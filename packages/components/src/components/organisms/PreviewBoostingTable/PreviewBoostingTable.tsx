import React from 'react'
import {
  IPrice,
  IScore,
  IStock,
  ITableHeader,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'
import CustomTable from '../CustomTable/CustomTable'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material'

const TableContainer = styled('div')(({ theme }) => ({
  '.tableTitles': {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontFamily: 'Inter',
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
      fontFamily: 'Inter',
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

interface IProduct {
  id: string | number
  image: string
  name: string[]
  price: IPrice[]
  stock: IStock
  score: IScore | number
}

interface IBoostingProducts {
  productsBefore: IProduct[]
  productsAfter: IProduct[]
}

const convertProductToRow = (
  productsBefore: IProduct[],
  productsAfter: IProduct[]
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
      beforeImage: beforeProduct.image,
      beforeInfo: {
        productName: beforeProduct?.name[0],
        stockStatus: beforeProduct?.stock.status,
        price: beforeProduct?.price[0]?.price,
      },
      beforeScore: beforeProduct.score,
      afterImage: afterProduct?.image,
      afterInfo: {
        productName: afterProduct?.name[0],
        stockStatus: afterProduct?.stock.status,
        price: afterProduct?.price[0]?.price,
      },
      afterScore: afterProduct?.score,
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
  productsBefore,
  productsAfter,
}: IBoostingProducts): JSX.Element {
  const { t } = useTranslation('boost')
  const products = convertProductToRow(productsBefore, productsAfter)

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
