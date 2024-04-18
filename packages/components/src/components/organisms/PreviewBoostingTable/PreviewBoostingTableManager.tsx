import React, { useEffect, useMemo, useState } from 'react'
import Pagination from '../../molecules/CustomTable/Pagination/Pagination'
import { useGraphqlApi } from '../../../hooks'
import { useTranslation } from 'next-i18next'
import PreviewBoostingTable from './PreviewBoostingTable'
import {
  IGraphqlPreviewBoost,
  LoadStatus,
  ProductRequestType,
  getPreviewBoostQuery,
} from '@elastic-suite/gally-admin-shared'
import { styled } from '@mui/material'
import { IPreviewBoostFilter } from '../../molecules/FiltersPreviewBoostingTabs/FiltersPreviewBoostingTabs'
import NoAttributes from '../../../components/atoms/noAttributes/NoAttributes'

const PreviewContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  fontFamily: 'var(--gally-font)',
  backgroundColor: '#E2E6F3',
  overflow: 'hidden',

  '.previewArea': {
    margin: 0,
    padding: 0,
    fontSize: '12px',
    fontFamily: 'var(--gally-font)',
    lineHeight: '18px',
    color: theme.palette.colors.neutral['600'],
  },
}))

export default function PreviewBoostingTableManager({
  filter,
  localizedCatalog,
  currentBoost,
}: {
  filter: IPreviewBoostFilter
  localizedCatalog: string
  currentBoost: Record<string, unknown>
}): JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [productsBefore, setProductsBefore] = useState([])
  const [productsAfter, setProductsAfter] = useState([])

  const rowsPerPage = 10

  const { t } = useTranslation('boost')

  const variables = useMemo(() => {
    const filterValue: {
      search?: string | number
      category?: string | number
    } = {}

    if (filter.type === ProductRequestType.SEARCH)
      filterValue.search = filter.search
    else if (filter.type === ProductRequestType.CATALOG)
      filterValue.category = filter.category

    return {
      localizedCatalog,
      requestType: filter.type,
      currentBoost: JSON.stringify(currentBoost),
      ...filterValue,
      currentPage: currentPage + 1,
      pageSize: rowsPerPage,
    }
  }, [filter, localizedCatalog, currentBoost, currentPage, rowsPerPage])

  const filterIsValid = useMemo<boolean>(
    () =>
      Boolean(
        filter.type === 'product_search' &&
          filter.search.length > 0 &&
          localizedCatalog
      ) ||
      Boolean(
        filter.type === 'product_catalog' && filter.category && localizedCatalog
      ),
    [filter, localizedCatalog]
  )

  const [{ data: previewBoostData, status }] =
    useGraphqlApi<IGraphqlPreviewBoost>(
      getPreviewBoostQuery(),
      variables,
      undefined,
      filterIsValid
    )

  useEffect(() => {
    setProductsBefore(previewBoostData?.previewBoost.resultsBefore || [])
    setProductsAfter(previewBoostData?.previewBoost.resultsAfter || [])
    setTotalItems(previewBoostData?.previewBoost.totalItems || 0)
  }, [previewBoostData])

  useEffect(() => {
    setCurrentPage(0)
  }, [filter])

  if (!filterIsValid) {
    return (
      <PreviewContainer>
        <p className="previewArea">{t('previewArea')}</p>
        <NoAttributes title={t('noFiltersPreviewMessage')} />
      </PreviewContainer>
    )
  }

  return (
    <>
      <Pagination
        style={{
          borderRadius: '8px',
          marginBottom: '16px',
          marginTop: '32px',
        }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        count={totalItems}
        rowsPerPageOptions={[]}
        withResults
      />
      <PreviewContainer>
        <p className="previewArea">{t('previewArea')}</p>
        <PreviewBoostingTable
          resultsBefore={productsBefore}
          resultsAfter={productsAfter}
          loading={status === LoadStatus.LOADING}
        />
        <Pagination
          style={{ padding: '0 16px', border: 'none' }}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          count={totalItems}
          rowsPerPageOptions={[]}
          withResults
          isBottom
        />
      </PreviewContainer>
    </>
  )
}
