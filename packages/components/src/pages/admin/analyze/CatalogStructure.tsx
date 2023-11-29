import React, {
  FormEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Box, styled } from '@mui/system'
import { Paper } from '@mui/material'
import {
  IApiSchemaOptions,
  ICategories,
  IExplainVariables,
  IHydraResponse,
  IRequestTypesOptions,
  ITreeItem,
  LimitationType,
  getLimitationType,
  getOptionsFromApiSchema,
  isGraphQLValidVariables,
} from '@elastic-suite/gally-admin-shared'

import { breadcrumbContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import { useApiList, useFetchApi, useResource } from '../../../hooks'
import { selectConfiguration, useAppSelector } from '../../../store'

import Button from '../../../components/atoms/buttons/Button'
import ProductsSearchPreview from '../../../components/stateful/ProductPreview/ProductsSearchPreview'
import ProductsCategoryPreview from '../../../components/stateful/ProductPreview/ProductsCategoryPreview'
import MerchandiseBar from '../../../components/stateful/ProductPreview/MerchandiseBar'
import {
  DropDownError,
  InputTextError,
  PageTitle,
  TreeSelector,
} from '../../../components'

const WrapperBlock = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  background: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1.5),
  flexDirection: 'row',
  alignItems: 'top',
  padding: theme.spacing(2),
}))

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'var(--gally-font)',
  lineHeight: '18px',
  paddingBottom: '18px',
  color: theme.palette.colors.neutral['600'],
}))

const pagesSlug = ['analyze', 'catalog_structure']

const INPUT_WIDTH = 296

function AdminAnalyzeCatalogStructure(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [variables, setVariables] = useState<IExplainVariables>({})
  const [variableValid, setVariableValid] = useState(false)
  const [nbResults, setNbResults] = useState(0)
  const [nbTopProducts, setNbTopProducts] = useState(0)

  const configuration = useAppSelector(selectConfiguration)
  const { t } = useTranslation(['api', 'categories'])

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const localizedCatalogOptionResource = useResource(
    'LocalizedCatalogGroupOption'
  )
  const [{ data: localizedCatalogData }] = useApiList<IApiSchemaOptions>(
    localizedCatalogOptionResource,
    false
  )

  const localizedCatalogOptions = localizedCatalogData
    ? getOptionsFromApiSchema(
        localizedCatalogData as IHydraResponse<IApiSchemaOptions>
      )
    : []

  const [requestTypeData] = useApiList<IRequestTypesOptions>(
    'explain_request_type_options',
    false
  )
  const requestTypeOptions = requestTypeData?.data
    ? getOptionsFromApiSchema(
        requestTypeData.data as IHydraResponse<IApiSchemaOptions>
      )
    : []

  const [categoriesListApi] = useFetchApi<ICategories>('categoryTree')
  const categoriesList = categoriesListApi?.data?.categories

  const limitationType =
    requestTypeData?.data && variables?.requestType
      ? getLimitationType(
          variables?.requestType,
          requestTypeData.data[
            'hydra:member'
          ] as unknown as IRequestTypesOptions[]
        )
      : undefined

  function handleChange(
    value: string | number | ITreeItem,
    event: SyntheticEvent
  ): void {
    setVariables({
      ...variables,
      [(event.target as HTMLInputElement).name]: value,
    })
    setVariableValid(false)
  }

  function handleCategoryChange(value: ITreeItem): void {
    setVariables({ ...variables, category: value })
    setVariableValid(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (isGraphQLValidVariables(variables, limitationType)) {
      setNbResults(0)
      setNbTopProducts(0)
      setVariableValid(true)
    } else {
      setVariableValid(false)
    }
  }

  if (!(localizedCatalogOptions && requestTypeOptions && categoriesList)) {
    return null
  }

  if (!variables.requestType && requestTypeOptions[0]) {
    setVariables({
      ...variables,
      requestType: requestTypeOptions[0].value
        ? String(requestTypeOptions[0].value)
        : undefined,
    })
  }

  return (
    <>
      <PageTitle
        title={t('Explain and compare')}
        sx={{ marginBottom: '32px' }}
      />
      <form onSubmit={handleSubmit}>
        <WrapperBlock>
          <DropDownError
            infoTooltip={t(
              'Select the localized catalog where the explain will be applied'
            )}
            label={t('Localized catalog')}
            name="localizedCatalog"
            onChange={handleChange}
            options={localizedCatalogOptions}
            value={variables?.localizedCatalog}
            useGroups
            placeholder={t('Select a localized catalog')}
            required
            showError
            sx={{ width: INPUT_WIDTH }}
          />
        </WrapperBlock>

        <WrapperBlock>
          <DropDownError
            label={t('Request type')}
            name="requestType"
            onChange={handleChange}
            options={requestTypeOptions}
            value={variables?.requestType}
            useGroups
            placeholder={t('Select a request type')}
            required
            showError
            sx={{ width: INPUT_WIDTH }}
          />
          {limitationType === 'category' && (
            <TreeSelector
              label={t('Category')}
              name="category"
              data={categoriesList}
              onChange={handleCategoryChange}
              value={variables?.category ?? null}
              placeholder={t('Select a category')}
              required
              sx={{ width: INPUT_WIDTH }}
            />
          )}

          {limitationType === 'search' && (
            <InputTextError
              infoTooltip={t('Search term')}
              label={t('Search term')}
              name="search"
              onChange={handleChange}
              value={variables?.search ? String(variables.search) : undefined}
              placeholder={t('Indicate a term')}
              required
              showError
              sx={{ width: INPUT_WIDTH }}
            />
          )}
          {limitationType ? (
            <Button sx={{ marginTop: '24px', height: 40 }} type="submit">
              {t('Explain')}
            </Button>
          ) : null}
        </WrapperBlock>
      </form>

      {variableValid ? (
        <Box sx={{ marginBottom: 2 }}>
          <MerchandiseBar nbResults={nbResults} nbTopProducts={nbTopProducts} />
        </Box>
      ) : null}

      {variableValid && limitationType ? (
        <Paper
          variant="outlined"
          sx={{ backgroundColor: 'colors.neutral.300', padding: 2 }}
        >
          <PreviewArea>{t('previewArea', { ns: 'categories' })}</PreviewArea>
          {limitationType === LimitationType.SEARCH && (
            <ProductsSearchPreview
              variables={variables}
              configuration={configuration}
              limitationType={limitationType}
              onProductsLoaded={setNbResults}
            />
          )}
          {limitationType === LimitationType.CATEGORY && (
            <ProductsCategoryPreview
              variables={variables}
              configuration={configuration}
              limitationType={limitationType}
              onProductsLoaded={setNbResults}
              onTopProductsLoaded={setNbTopProducts}
            />
          )}
        </Paper>
      ) : null}
    </>
  )
}

export default withAuth(withOptions(AdminAnalyzeCatalogStructure))
