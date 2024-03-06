import React from 'react'
import {
  IPreviewBoostingProducts,
  IPreviewProduct,
  ITableHeader,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'
import CustomTable from '../CustomTable/CustomTable'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import { useTranslation } from 'next-i18next'
import { CircularProgress, styled } from '@mui/material'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: theme.spacing(8),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  background: theme.palette.colors.white,
  textAlign: 'center',
  alignItems: 'center',
}))

const TableContainer = styled('div')(({ theme }) => ({
  '.tableTitles': {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontFamily: 'var(--gally-font)',
    p: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#151A47',
      margin: 0,
      '&.after': {
        fontWeight: 600,
      },
    },
  },
  table: {
    'th, td': {
      fontSize: '14px',
      fontFamily: 'var(--gally-font)',
      lineHeight: '20px',
    },
    th: {
      color: '#2F3674',
      fontWeight: 500,
    },
    td: {
      color: '#151A47',
      fontWeight: 400,
    },
  },
}))

const convertProductToRow = (
  productsBefore: IPreviewProduct[],
  productsAfter: IPreviewProduct[]
): ITableRow[] => {
  const dataInfo =
    productsBefore.length >= productsAfter.length
      ? {
          field: 'before',
          products: productsBefore,
          otherProducts: productsAfter,
        }
      : {
          field: 'after',
          products: productsAfter,
          otherProducts: productsBefore,
        }

  return dataInfo.products.map((product, index) => {
    const beforeProduct =
      dataInfo.field === 'before' ? product : dataInfo.otherProducts[index]
    const afterProduct =
      dataInfo.field === 'after' ? product : dataInfo.otherProducts[index]

    return {
      id: product.id,
      beforeImage: `/media/catalog/product${beforeProduct.image}`,
      beforeInfo: {
        productName: beforeProduct?.name,
        stockStatus: beforeProduct?.stock.status,
        price: beforeProduct?.price[0]?.price,
      },
      beforeScore: beforeProduct.score,
      afterImage: `/media/catalog/product${afterProduct?.image}`,
      afterInfo: {
        productName: afterProduct?.name,
        stockStatus: afterProduct?.stock.status,
        price: afterProduct?.price[0]?.price,
      },
      afterScore: {
        scoreValue:
          typeof afterProduct?.score === 'number'
            ? afterProduct?.score
            : afterProduct?.score.scoreValue,
        boostInfos: {
          type:
            afterProduct?.effect === 0
              ? 'straight'
              : afterProduct?.effect === 1
              ? 'up'
              : 'down',
        },
      },
    }
  })
}

const globalStyle = {
  verticalAlign: 'middle',
}

const scoreFieldStyle = {
  borderLeft: '1px solid #E2E6F3',
}

const tableHeaders = [
  {
    id: 'beforeImage',
    name: 'beforeImage',
    label: 'Image',
    input: 'image',
    editable: false,
    sticky: false,
    cellsStyle: {
      ...globalStyle,
      paddingRight: 0,
    },
  },
  {
    id: 'beforeInfo',
    name: 'beforeInfo',
    label: 'Info',
    input: 'productInfo',
    editable: false,
    sticky: false,
    cellsStyle: globalStyle,
  },
  {
    id: 'beforeScore',
    name: 'beforeScore',
    label: 'Score',
    input: 'score',
    editable: false,
    sticky: false,
    headerStyle: {
      borderRight: '2px solid #1812A0',
    },
    cellsStyle: {
      borderRight: '2px solid #1812A0',
      ...globalStyle,
      ...scoreFieldStyle,
    },
  },
  {
    id: 'afterImage',
    name: 'afterImage',
    label: 'Image',
    input: 'image',
    editable: false,
    sticky: false,
    cellsStyle: {
      ...globalStyle,
      paddingRight: 0,
    },
  },
  {
    id: 'afterInfo',
    name: 'afterInfo',
    label: 'Info',
    input: 'productInfo',
    editable: false,
    sticky: false,
    cellsStyle: globalStyle,
  },
  {
    id: 'afterScore',
    name: 'afterScore',
    label: 'Score',
    input: 'score',
    editable: false,
    sticky: false,
    cellsStyle: { ...globalStyle, ...scoreFieldStyle },
  },
] as ITableHeader[]

function PreviewBoostingTable({
  resultsBefore,
  resultsAfter,
  loading,
}: IPreviewBoostingProducts & { loading?: boolean }): JSX.Element {
  const { t } = useTranslation('boost')
  const products = convertProductToRow(resultsBefore, resultsAfter)

  if (loading)
    return (
      <CustomRoot>
        <CircularProgress color="inherit" size="25px" />
      </CustomRoot>
    )

  if (products.length === 0)
    return <NoAttributes title={t('noProductSearch')} />

  return (
    <>
      <TableContainer>
        <div className="tableTitles">
          <p className="before">{t('beforeBoosting')}</p>
          <p className="after">{t('afterBoosting')}</p>
        </div>
        <CustomTable
          withoutDragableColumn
          Field={FieldGuesser}
          tableHeaders={tableHeaders}
          tableRows={products}
        />
      </TableContainer>
    </>
  )
}

export default PreviewBoostingTable
