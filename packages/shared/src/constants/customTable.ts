import { DataContentType, ITableHeader, ImageIcon } from '../types'

export const reorderingColumnWidth = 48 // 48px provide by Figma
export const selectionColumnWidth = 40 // In Figma, it should be 68px but it takes too much space
export const stickyColumnWidth = 134 // fixed width for sticky column width ( TODO : add a table )
export const stickyColumnMaxWidth = 134
export const stickyColumnPadding = '14px 16px'

export const columnMaxWidth = 220

export const productTableheader: ITableHeader[] = [
  {
    id: 'sku',
    input: DataContentType.STRING,
    name: 'sku',
    label: 'Code',
    type: DataContentType.STRING,
  },
  {
    id: 'image',
    input: DataContentType.IMAGE,
    name: 'image',
    label: 'Image',
    type: DataContentType.IMAGE,
  },
  {
    id: 'name',
    input: DataContentType.STRING,
    name: 'name',
    label: 'Name',
    type: DataContentType.STRING,
  },
  {
    id: 'score',
    input: DataContentType.SCORE,
    name: 'score',
    label: 'Score',
    type: DataContentType.SCORE,
  },
  {
    id: 'stock',
    input: DataContentType.STOCK,
    name: 'stock',
    label: 'Stock',
    type: DataContentType.STOCK,
  },
  {
    id: 'price',
    input: DataContentType.PRICE,
    name: 'price',
    label: 'Price',
    type: DataContentType.PRICE,
  },
]

export const defaultRowsPerPageOptions = [10, 25, 50]

export const imageIconLabels = {
  [ImageIcon.PIN]: 'Pinned',
}
