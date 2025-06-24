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
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  IProductPositions,
  IRuleEngineOperators,
} from '@elastic-suite/gally-admin-shared'

import { selectConfiguration, useAppSelector } from '../../../store'

import BottomTable from '../TopAndBottomTable/BottomTable'
import TopTable from '../TopAndBottomTable/TopTable'
import { TestId, generateTestId } from '../../../utils/testIds'

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
  catConf: IParsedCategoryConfiguration
  ruleOperators: IRuleEngineOperators
  hasEditLink?: boolean
  editLink?: string
  componentId?: string
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
    catConf,
    ruleOperators,
    hasEditLink,
    editLink,
    componentId,
  } = props
  const { t } = useTranslation('categories')

  const topProductsIds = topProducts.map((topProduct) => topProduct.productId)

  const configuration = useAppSelector(selectConfiguration)

  return (
    configuration && (
      <Paper
        variant="outlined"
        sx={{ backgroundColor: 'colors.neutral.300' }}
        data-testid={generateTestId(TestId.TOP_AND_BOTTOM_TABLE, componentId)}
      >
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
              catConf={catConf}
              ruleOperators={ruleOperators}
              hasEditLink={hasEditLink}
              editLink={editLink}
              componentId={componentId}
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
            catConf={catConf}
            ruleOperators={ruleOperators}
            hasEditLink={hasEditLink}
            editLink={editLink}
            componentId={componentId}
          />
        </Box>
      </Paper>
    )
  )
}

export default forwardRef(ProductsTopAndBottom)
