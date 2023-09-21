import React, { useEffect, useState } from 'react'
import PreviewBoostingTable from '../../organisms/PreviewBoostingTable/PreviewBoostingTable'
import FiltersPreviewBoostingTabs, {
  IPreviewBoostFilter,
} from '../../molecules/FiltersPreviewBoostingTabs/FiltersPreviewBoostingTabs'
import { useTranslation } from 'react-i18next'
import { ITreeItem } from '@elastic-suite/gally-admin-shared'
import { styled } from '@mui/material'
import Pagination from '../../molecules/CustomTable/Pagination/Pagination'

import productsMock from '../../../../public/mocks/boosts_preview_bags_search.json'
import categoriesMock from '../../../../public/mocks/categories.json'

const PreviewContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  fontFamily: 'Inter',
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

export default function PreviewGridBoostConfiguration(): JSX.Element {
  const [filter, setFilter] = useState<IPreviewBoostFilter>({
    type: 'search',
    value: '',
  })
  const [products, setProducts] = useState<
    | {
        id: string
        resultsAfter: any
        resultsBefore: any
      }
    | undefined
  >(undefined)
  const [categories, setCategories] = useState<ITreeItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const rowsPerPage = 20
  const { t } = useTranslation('boost')

  useEffect(() => {
    // TODO : Replace by GRAPHQL request
    setProducts(undefined)
    if (filter.value) {
      setProducts(productsMock.data.previewBoost)
      setCount(productsMock.data.previewBoost.resultsAfter.length)
      setCurrentPage(0)
    }
  }, [filter])

  useEffect(() => {
    // TODO: Replace by GRAPHQL request
    setCategories(categoriesMock.categories)
  }, [])

  return (
    <>
      <FiltersPreviewBoostingTabs
        onSendFilter={setFilter}
        categories={categories}
      />
      {Boolean(products) && (
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
            count={count}
            rowsPerPageOptions={[]}
            withResults
          />
          <PreviewContainer>
            <p className="previewArea">{t('previewArea')}</p>
            <PreviewBoostingTable
              productsBefore={products?.resultsBefore}
              productsAfter={products?.resultsAfter}
            />
            <Pagination
              style={{ padding: '0 16px', border: 'none' }}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              count={count}
              rowsPerPageOptions={[]}
              withResults
              isBottom
            />
          </PreviewContainer>
        </>
      )}
    </>
  )
}
