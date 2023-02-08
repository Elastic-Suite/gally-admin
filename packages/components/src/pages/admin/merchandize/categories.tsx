import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import {
  ICategories,
  ICategory,
  ICategoryConfiguration,
  IParsedCategoryConfiguration,
  IRuleCombination,
  LoadStatus,
  isError,
  isRuleValid,
  isVirtualCategoryEnabled,
  parseCatConf,
  savePositions,
  serializeCatConf,
} from '@elastic-suite/gally-admin-shared'

import { breadcrumbContext, catalogContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import {
  useApiFetch,
  useApiGraphql,
  useFetchApi,
  useResource,
  useResourceOperations,
  useRuleEngineGraphqlFilters,
  useRuleOperators,
} from '../../../hooks'
import { findCategory } from '../../../services'
import { selectBundles, useAppSelector } from '../../../store'

import Placeholder from '../../../components/atoms/Placeholder/Placeholder'
import TitleBlock from '../../../components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '../../../components/molecules/layout/twoColsLayout/TwoColsLayout'
import CatalogSwitcher from '../../../components/stateful/CatalogSwitcher/CatalogSwitcher'
import CategoryTree from '../../../components/stateful/CategoryTree/CategoryTree'
import ProductsContainer from '../../../components/stateful/ProductsContainer/ProductsContainer'
import RulesManager from '../../../components/stateful/RulesManager/RulesManager'

const pagesSlug = ['merchandize', 'categories']

function AdminMerchandizeCategories(): JSX.Element {
  const router = useRouter()
  const fetchApi = useApiFetch()
  const { t } = useTranslation('categories')
  const [isLoading, setIsLoading] = useState(false)
  const bundles = useAppSelector(selectBundles)
  const { catalogId, localizedCatalogId } = useContext(catalogContext)

  // Breadcrumb
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  // Rule engine operators
  const ruleOperators = useRuleOperators()

  // Categories
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()
  const filters = useMemo(() => {
    const filters: { catalogId?: number; localizedCatalogId?: number } = {}
    if (catalogId && localizedCatalogId) {
      if (catalogId !== -1) {
        filters.catalogId = catalogId
      }
      if (localizedCatalogId !== -1) {
        filters.localizedCatalogId = localizedCatalogId
      }
    }

    return filters
  }, [catalogId, localizedCatalogId])
  const [categories] = useFetchApi<ICategories>('categoryTree', filters)
  useEffect(() => {
    if (categories.status !== LoadStatus.SUCCEEDED) {
      return
    }
    setSelectedCategoryItem((prevState) => {
      if (!categories.data.categories[0]) {
        return undefined
      }
      if (prevState === undefined) {
        return categories.data.categories[0]
      }
      const cat = findCategory(prevState, categories.data.categories)
      return cat
    })
  }, [categories])

  // Category configuration
  const catConfResource = useResource('CategoryConfiguration')
  const [catConf, setCatConf] = useState<IParsedCategoryConfiguration>()
  const prevCatConf = useRef<IParsedCategoryConfiguration>()
  const { update, create } =
    useResourceOperations<ICategoryConfiguration>(catConfResource)
  useEffect(() => {
    if (
      selectedCategoryItem?.id &&
      categories.status === LoadStatus.SUCCEEDED
    ) {
      if (
        categories?.data?.categories.find(
          (item) => item.id === selectedCategoryItem?.id
        )
      ) {
        fetchApi<ICategoryConfiguration>(
          `${catConfResource.url}/category/${selectedCategoryItem.id}`,
          filters
        ).then((catConf) => {
          if (!isError(catConf)) {
            const parsedCatConf = parseCatConf(catConf)
            prevCatConf.current = parsedCatConf
            setCatConf(parsedCatConf)
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchApi, selectedCategoryItem?.id, catConfResource.url, categories])

  const isValid = !catConf?.isVirtual || isRuleValid(catConf?.virtualRule)

  // Rule engine graphql filters
  const [productGraphqlFilters, setRuleEngineGraphqlFilters] =
    useRuleEngineGraphqlFilters(catConf, ruleOperators, selectedCategoryItem)

  // Product positions
  const prevProductPositions = useRef<string>('')

  function handleUpdateCat(name: string, val: boolean | string): void {
    setCatConf((catConf) => ({ ...catConf, [name]: val }))
  }

  function handleUpdateRule(rule: IRuleCombination): void {
    setCatConf((catConf) => ({ ...catConf, virtualRule: rule }))
  }

  function handleSelectCategory(category: ICategory): void {
    setSelectedCategoryItem(category)
    setCatConf(null)
    setRuleEngineGraphqlFilters(null)
  }

  const graphqlApi = useApiGraphql()
  async function saveProductPositions(positions: string): Promise<void> {
    const variables = {
      categoryId: selectedCategoryItem?.id,
      savePositionsCategory: positions,
    }
    const json = await graphqlApi(savePositions, variables)
    if (!isError(json)) {
      prevProductPositions.current = positions
    } else {
      throw new Error(json.error.message)
    }
  }

  async function saveCategoryConfiguration(): Promise<void> {
    const serializedCatConf = serializeCatConf(catConf, ruleOperators)
    if (!catConf.id) {
      delete serializedCatConf['@id']
      const newCatConf = await create(serializedCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = parseCatConf(newCatConf)
        prevCatConf.current = parsedCatConf
        setCatConf(parsedCatConf)
      } else {
        throw new Error(newCatConf.error.message)
      }
    } else {
      const newCatConf = await update(serializedCatConf.id, serializedCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = parseCatConf(newCatConf)
        prevCatConf.current = parsedCatConf
        setCatConf(parsedCatConf)
      } else {
        throw new Error(newCatConf.error.message)
      }
    }
  }

  async function onSave(result: string): Promise<void> {
    setIsLoading(true)
    const promiseGraphQlSetPositions = saveProductPositions(result)
    const promiseApiRestVal = saveCategoryConfiguration()
    try {
      await Promise.all([promiseGraphQlSetPositions, promiseApiRestVal])
      enqueueSnackbar(t('alert'), {
        onShut: closeSnackbar,
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar(t('alert.error'), {
        onShut: closeSnackbar,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <TwoColsLayout
        left={[
          <TitleBlock key="categories" title={t(pagesSlug.at(-1))}>
            <>
              <CatalogSwitcher />
              <CategoryTree
                categories={categories.data}
                selectedItem={selectedCategoryItem}
                onSelect={handleSelectCategory}
              />
            </>
          </TitleBlock>,
          isVirtualCategoryEnabled(bundles) && ruleOperators && (
            <TitleBlock
              key="virtualRule"
              title={catConf?.isVirtual ? t('virtualRule.title') : ''}
            >
              <RulesManager
                active={catConf?.isVirtual}
                onChange={handleUpdateRule}
                rule={catConf?.virtualRule}
                ruleOperators={ruleOperators}
              />
            </TitleBlock>
          ),
        ]}
      >
        {Boolean(selectedCategoryItem?.id) && (
          <Placeholder placeholder={t('placeholder')}>
            <ProductsContainer
              catConf={catConf}
              category={selectedCategoryItem}
              isValid={isValid}
              onChange={handleUpdateCat}
              onSave={onSave}
              prevCatConf={prevCatConf}
              prevProductPositions={prevProductPositions}
              productGraphqlFilters={productGraphqlFilters}
              isLoading={isLoading}
            />
          </Placeholder>
        )}
      </TwoColsLayout>
    </>
  )
}

export default withAuth(withOptions(AdminMerchandizeCategories))
