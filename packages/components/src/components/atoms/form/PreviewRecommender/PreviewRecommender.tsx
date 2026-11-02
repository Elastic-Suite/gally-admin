import React, { useContext, useMemo, useState } from 'react'
import { CircularProgress, styled } from '@mui/material'
import { useTranslation } from 'next-i18next'
import {
  IGraphqlRecommenderPreview,
  IOptions,
  ITableHeader,
  ITableRow,
  LoadStatus,
  RecommenderPreviewStatus,
  getIdFromIri,
  getRecommenderPreviewQuery,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../../hooks'
import { catalogContext } from '../../../../contexts'
import { selectConfiguration, useAppSelector } from '../../../../store'
import { TestId, generateTestId } from '../../../../utils/testIds'
import DropDown from '../DropDown'
import InputText from '../InputText'
import Button from '../../buttons/Button'
import NoAttributes from '../../noAttributes/NoAttributes'
import CustomTable from '../../../organisms/CustomTable/CustomTable'
import FieldGuesser from '../../../stateful/FieldGuesser/FieldGuesser'

const Message = styled('p')(() => ({
  color: 'var(--neutral-900, #151A47)',
  fontFamily: 'var(--gally-font)',
  fontSize: '14px',
  lineHeight: '28px',
}))

const Filters = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const tableHeaders = [
  {
    id: 'image',
    name: 'image',
    label: 'Image',
    input: 'image',
    editable: false,
    sticky: false,
  },
  {
    id: 'info',
    name: 'info',
    label: 'Info',
    input: 'productInfo',
    editable: false,
    sticky: false,
  },
  {
    id: 'sku',
    name: 'sku',
    label: 'Sku',
    input: 'string',
    editable: false,
    sticky: false,
  },
  {
    id: 'origin',
    name: 'origin',
    label: 'Origin',
    input: 'tag',
    editable: false,
    sticky: false,
  },
] as ITableHeader[]

interface IPreviewRecommenderProps {
  currentRecommender: Record<string, unknown>
}

/**
 * Products recommended by the recommender being edited for a source product, whatever its status and dates.
 */
export default function PreviewRecommender({
  currentRecommender,
}: IPreviewRecommenderProps): JSX.Element {
  const { t } = useTranslation('recommender')
  const { t: tCommon } = useTranslation('common')
  const { catalogs } = useContext(catalogContext)
  const configuration = useAppSelector(selectConfiguration)

  const [localizedCatalog, setLocalizedCatalog] = useState('')
  const [productSku, setProductSku] = useState('')
  // The preview runs for the source product once it is submitted
  const [submittedProductSku, setSubmittedProductSku] = useState('')

  const localizedCatalogs: IOptions<string> = useMemo(() => {
    const localizedCatalogIds = (
      (currentRecommender.localizedCatalogs as string[]) || []
    ).map((value) => getIdFromIri(value))
    return catalogs
      .map((catalog) =>
        catalog.localizedCatalogs.map((localizedCatalog) => ({
          label: localizedCatalog.name,
          value: localizedCatalog.id.toString(),
          id: catalog.name,
        }))
      )
      .flat()
      .filter((option) => localizedCatalogIds.includes(option.value))
  }, [catalogs, currentRecommender.localizedCatalogs])

  const recommenderIsValid =
    localizedCatalogs.length > 0 &&
    Boolean((currentRecommender.recommenderTypes as [])?.length > 0)
  const canPreview =
    recommenderIsValid &&
    Boolean(localizedCatalog) &&
    Boolean(submittedProductSku)

  const variables = useMemo(
    () => ({
      localizedCatalog,
      productSku: submittedProductSku,
      currentRecommender: JSON.stringify(currentRecommender),
    }),
    [localizedCatalog, submittedProductSku, currentRecommender]
  )
  const [{ data, error, status }] = useGraphqlApi<IGraphqlRecommenderPreview>(
    getRecommenderPreviewQuery(),
    variables,
    undefined,
    canPreview
  )

  if (!recommenderIsValid) {
    return (
      <Message data-testid={generateTestId(TestId.PREVIEW_REQUIRED_MESSAGE)}>
        {t('preview.missingRequiredFields')}
      </Message>
    )
  }

  const preview = data?.getRecommenderPreview
  const rows: ITableRow[] = (preview?.products ?? []).map((product) => ({
    id: product.id,
    image: product.image,
    info: {
      productName: product.name,
      stockStatus: product.stock?.status,
      price: product.price?.[0]?.price,
    },
    sku: product.sku,
    origin: t(`preview.origin.${product.origin}`),
  }))

  let content: JSX.Element
  if (!canPreview) {
    content = <NoAttributes title={t('preview.noSourceProduct')} />
  } else if (status === LoadStatus.LOADING) {
    content = <CircularProgress color="inherit" size="25px" />
  } else if (error) {
    content = <Message>{error.message}</Message>
  } else if (preview && preview.status !== RecommenderPreviewStatus.OK) {
    content = <NoAttributes title={t(`preview.status.${preview.status}`)} />
  } else if (rows.length === 0) {
    content = <NoAttributes title={t('preview.noProduct')} />
  } else {
    content = (
      <CustomTable
        withoutDragableColumn
        Field={FieldGuesser}
        tableHeaders={tableHeaders}
        tableRows={rows}
        configuration={configuration}
      />
    )
  }

  return (
    <div data-testid={generateTestId(TestId.RECOMMENDER_PREVIEW)}>
      <Filters>
        <DropDown
          onChange={(value: string): void => setLocalizedCatalog(value)}
          value={localizedCatalog}
          options={localizedCatalogs}
          placeholder={tCommon('localizedCatalog.placeholder')}
          useGroups
          required
          label={tCommon('localizedCatalog')}
          componentId="previewLocalizedCatalog"
        />
        <InputText
          value={productSku}
          onChange={(value: string): void => setProductSku(value)}
          label={t('preview.productSku')}
          placeholder={t('preview.productSku')}
          componentId="previewProductSku"
        />
        <Button
          display="secondary"
          disabled={!localizedCatalog || !productSku}
          onClick={(): void => setSubmittedProductSku(productSku.trim())}
          componentId="previewSubmit"
        >
          {t('preview.submit')}
        </Button>
      </Filters>
      {content}
    </div>
  )
}
