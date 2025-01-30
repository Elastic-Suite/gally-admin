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
  ProductRequestType,
  getLimitationType,
  getOptionsFromApiSchema,
  isGraphQLValidVariables,
} from '@elastic-suite/gally-admin-shared'

import { breadcrumbContext, catalogContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import { useApiList, useFetchApi, useResource } from '../../../hooks'
import { selectConfiguration, useAppSelector } from '../../../store'

import Button from '../../../components/atoms/buttons/Button'
import MerchandiseBar from '../../../components/stateful/ProductPreview/MerchandiseBar'
import { DropDown, InputText, PageTitle } from '../../../components'
import TreeSelector from '../../../components/atoms/form/TreeSelector'
import ProductsPreviewBottom from '../../../components/stateful/ProductPreview/ProductsPreviewBottom'
import Form from '../../../components/atoms/form/Form'

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

const pagesSlug = ['analyze', 'results']

const INPUT_WIDTH = 296

function AdminAnalyzeResults(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { localizedCatalogWithDefault } = useContext(catalogContext)

  const [variables, setVariables] = useState<IExplainVariables>({})
  const [variableValid, setVariableValid] = useState(false)
  const [nbResults, setNbResults] = useState(0)
  const [nbTopProducts, setNbTopProducts] = useState(0)
  const [showAllErrors, setShowAllErrors] = useState(false)

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

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      if (isGraphQLValidVariables(variables, limitationType)) {
        setNbResults(0)
        setNbTopProducts(0)
        setVariableValid(true)
      } else {
        setVariableValid(false)
      }
    } else {
      setShowAllErrors(true)
    }
  }

  function setProductCounts(nbResults: number, nbTopProducts: number): void {
    setNbResults(nbResults)
    setNbTopProducts(nbTopProducts)
  }

  if (
    !variables.requestType &&
    requestTypeOptions[0] &&
    localizedCatalogOptions[0]
  ) {
    const defaultRequestType = requestTypeOptions.find(
      (option) => option.value === ProductRequestType.SEARCH
    )
    const defaultRequestTypeValue = defaultRequestType
      ? defaultRequestType.value
      : requestTypeOptions[0].value
    const defaultLocalizedCatalog = localizedCatalogOptions.find(
      (option) => String(option.value) === localizedCatalogWithDefault?.['@id']
    )
    const defaultLocalizedCatalogValue = defaultLocalizedCatalog
      ? defaultLocalizedCatalog.value
      : localizedCatalogOptions[0].value

    setVariables({
      ...variables,
      requestType: defaultRequestTypeValue
        ? String(defaultRequestTypeValue)
        : undefined,
      localizedCatalog: defaultLocalizedCatalogValue
        ? String(defaultLocalizedCatalogValue)
        : undefined,
    })
  }

  return (
    <>
      <PageTitle title={t('Results')} sx={{ marginBottom: '32px' }} />
      <Form onSubmit={handleSubmit}>
        {Boolean(
          localizedCatalogOptions && requestTypeOptions && categoriesList
        ) && (
          <>
            <WrapperBlock>
              <DropDown
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
                showError={showAllErrors}
                sx={{ width: INPUT_WIDTH }}
              />
            </WrapperBlock>

            <WrapperBlock>
              <DropDown
                label={t('Request type')}
                name="requestType"
                onChange={handleChange}
                options={requestTypeOptions}
                value={variables?.requestType}
                useGroups
                placeholder={t('Select a request type')}
                required
                showError={showAllErrors}
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
                  showError={showAllErrors}
                  sx={{ width: INPUT_WIDTH }}
                />
              )}

              {limitationType === 'search' && (
                <InputText
                  label={t('Search term')}
                  name="search"
                  onChange={handleChange}
                  value={
                    variables?.search ? String(variables.search) : undefined
                  }
                  placeholder={t('Indicate a term')}
                  required
                  showError={showAllErrors}
                  sx={{ width: INPUT_WIDTH }}
                />
              )}
              {limitationType ? (
                <Button sx={{ marginTop: '24px', height: 40 }} type="submit">
                  {t('Explain')}
                </Button>
              ) : null}
            </WrapperBlock>
          </>
        )}
      </Form>

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
          <ProductsPreviewBottom
            variables={variables}
            configuration={configuration}
            onProductsLoaded={setProductCounts}
            limitationType={limitationType}
          />
        </Paper>
      ) : null}
    </>
  )
}

export default withAuth(withOptions(AdminAnalyzeResults))
