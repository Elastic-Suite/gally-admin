import { IFieldConfig, IFieldState } from './field'
import { ICustomDialog } from './popin'

export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
}

export enum DataContentType {
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  LABEL = 'label',
  NUMBER = 'number',
  PRICE = 'price',
  RANGE = 'range',
  SCORE = 'score',
  SELECT = 'select',
  STOCK = 'stock',
  STRING = 'string',
  PASSWORD = 'password',
  EMAIL = 'email',
  TAG = 'tag',
  BUTTON = 'button',
  OPTGROUP = 'optgroup',
  RANGEDATE = 'rangeDate',
  REQUESTTYPE = 'requestType',
  RULEENGINE = 'ruleEngine',
  SLIDER = 'slider',
  MULTIPLEINPUT = 'multipleInput',
  SYNONYM = 'synonym',
  EXPANSION = 'expansion',
  PRODUCTINFO = 'productInfo',
  BOOSTPREVIEW = 'boostPreview',
  POSITIONEFFECT = 'positionEffect',
  PROPARTIONALTOATTRIBUTE = 'proportionalToAttribute',
  LOGS = 'logs',
}

export type ITableHeader = IFieldConfig

export interface IBaseStyle {
  left: string
  backgroundColor: string
  zIndex: string
}

export interface INonStickyStyle {
  borderBottomColor: string
  backgroundColor: string
  overflow?: string
}

export interface ISelectionStyle extends IBaseStyle {
  stickyBorderStyle?: IStickyBorderStyle
}

export interface IStickyStyle extends IBaseStyle {
  minWidth: string
  maxWidth?: string
  stickyBorderStyle?: IStickyBorderStyle
  overflow?: string
}
export interface IDraggableColumnStyle extends IBaseStyle {
  minWidth: string
  borderRight?: string
  stickyBorderStyle?: IStickyBorderStyle
}

export interface IStickyBorderStyle {
  borderBottomColor: string
  borderRight: string
  borderRightColor: string
  boxShadow?: string
  clipPath?: string
}

export interface ITableRow {
  id: string | number
  popIn?: ICustomDialog
  [key: string]:
    | string
    | boolean
    | number
    | IScore
    | IImage
    | IStock
    | IPrice[]
    | IProductInfo
    | ICustomDialog
    | IPositionEffect
}

export interface IHorizontalOverflow {
  isAtEnd: boolean
  isOverflow: boolean
  shadow: boolean
}

export interface ITableHeaderSticky extends ITableHeader {
  isLastSticky: boolean
}

export type ITableConfig = Record<string, IFieldState>

export type BoostType = 'up' | 'down' | 'straight'

export type PositionEffectType = 'up' | 'down' | 'straight'

export enum ImageIcon {
  PIN = 'push-pin',
}

export interface IBoost {
  type: BoostType
  boostNumber?: number
  boostMultiplicator?: number
}

export interface IStock {
  status: boolean
  qty?: number
}

export interface IScore {
  scoreValue: number
  boostInfos?: IBoost
}

export interface IImage {
  path: string
  icons?: ImageIcon[]
}

export interface IPrice {
  price: number
}

export interface IProductInfo {
  productName: string
  price: IPrice['price']
  stockStatus: IStock['status']
}

export interface IPositionEffect {
  type: PositionEffectType
}
