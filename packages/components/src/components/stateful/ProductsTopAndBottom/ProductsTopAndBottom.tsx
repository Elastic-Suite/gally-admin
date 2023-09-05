import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
} from 'react'
import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import {
  ICategory,
  IGraphqlProductPosition,
  IProductFieldFilterInput,
  IProductPositions,
} from '@elastic-suite/gally-admin-shared'

import { selectConfiguration, useAppSelector } from '../../../store'

import BottomTable from '../TopAndBottomTable/BottomTable'
import TopTable from '../TopAndBottomTable/TopTable'

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'var(--gally-font)',
  lineHeight: '18px',
  padding: '16px 0  0 16px',
  color: theme.palette.colors.neutral['600'],
}))

interface IProps {
  category: ICategory
  bottomSelectedRows: (string | number)[]
  onBottomSelectedRows: (rowIds: string[]) => void
  onTopSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topSelectedRows: (string | number)[]
  topProducts: IProductPositions
  setNbBottomRows: (value: number) => void
  setNbTopRows: (value: number) => void
  sortValue: string
  searchValue: string
  nbTopProducts: number
  hasEditLink?: boolean
  editLink?: string
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    category,
    bottomSelectedRows,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    setProductPositions,
    topSelectedRows,
    topProducts,
    setNbBottomRows,
    setNbTopRows,
    sortValue,
    searchValue,
    nbTopProducts,
    hasEditLink,
    editLink,
  } = props
  const { t } = useTranslation('categories')

  const topProductsIds = topProducts
    .map((topProduct) => topProduct.productId)
    .sort()

  const configuration = useAppSelector(selectConfiguration)

  return (
    configuration && (
      <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
        <PreviewArea>{t('previewArea')}</PreviewArea>
        <Box sx={{ padding: '28px 16px 17px 16px' }}>
          {topProducts.length !== 0 && (
            <TopTable
              category={category}
              selectedRows={topSelectedRows}
              onSelectedRows={onTopSelectedRows}
              productGraphqlFilters={productGraphqlFilters}
              setProductPositions={setProductPositions}
              topProducts={topProducts}
              topProductsIds={topProductsIds}
              sortValue={sortValue}
              searchValue={searchValue}
              configuration={configuration}
              setNbTopRows={setNbTopRows}
              hasEditLink={hasEditLink}
              editLink={editLink}
            />
          )}
          <BottomTable
            ref={ref}
            category={category}
            selectedRows={bottomSelectedRows}
            onSelectedRows={onBottomSelectedRows}
            productGraphqlFilters={productGraphqlFilters}
            topProductsIds={topProductsIds}
            setNbBottomRows={setNbBottomRows}
            sortValue={sortValue}
            searchValue={searchValue}
            configuration={configuration}
            nbTopProducts={nbTopProducts}
            hasEditLink={hasEditLink}
            editLink={editLink}
          />
        </Box>
      </Paper>
    )
  )
}

export default forwardRef(ProductsTopAndBottom)
