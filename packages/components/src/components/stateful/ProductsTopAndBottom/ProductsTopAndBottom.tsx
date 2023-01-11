import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
} from 'react'
import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import { useTranslation } from 'react-i18next'
import {
  IGraphqlProductPosition,
  IProductFieldFilterInput,
  IProductPositions,
} from 'gally-admin-shared'

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
  bottomSelectedRows: (string | number)[]
  onBottomSelectedRows: (rowIds: string[]) => void
  onTopSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topSelectedRows: (string | number)[]
  topProducts: IProductPositions
  setNbBottomRows: (value: number) => void
  sortValue: string
  searchValue: string
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    bottomSelectedRows,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    setProductPositions,
    topSelectedRows,
    topProducts,
    setNbBottomRows,
    sortValue,
    searchValue,
  } = props
  const { t } = useTranslation('categories')

  const topProductsIds = topProducts
    .map((topProduct) => topProduct.productId)
    .sort()

  const { current } = ref
  useEffect(() => {
    if (current && searchValue) {
      current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [current, searchValue])

  const configuration = useAppSelector(selectConfiguration)

  return (
    configuration && (
      <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
        <PreviewArea>{t('previewArea')}</PreviewArea>
        <Box sx={{ padding: '42px 16px 17px 16px' }}>
          {topProducts.length !== 0 && (
            <TopTable
              selectedRows={topSelectedRows}
              onSelectedRows={onTopSelectedRows}
              productGraphqlFilters={productGraphqlFilters}
              setProductPositions={setProductPositions}
              topProducts={topProducts}
              topProductsIds={topProductsIds}
              sortValue={sortValue}
              configuration={configuration}
            />
          )}
          <Box
            sx={
              topProducts.length !== 0 && sortValue === 'category__position'
                ? { marginTop: '24px' }
                : {}
            }
          >
            <BottomTable
              ref={ref}
              selectedRows={bottomSelectedRows}
              onSelectedRows={onBottomSelectedRows}
              productGraphqlFilters={productGraphqlFilters}
              topProductsIds={topProductsIds}
              setNbBottomRows={setNbBottomRows}
              sortValue={sortValue}
              searchValue={searchValue}
              configuration={configuration}
            />
          </Box>
        </Box>
      </Paper>
    )
  )
}

export default forwardRef(ProductsTopAndBottom)
