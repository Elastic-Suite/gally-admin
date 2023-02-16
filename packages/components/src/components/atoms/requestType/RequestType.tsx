import React, { ReactNode, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import DropDown from '../form/DropDown'
import ItemRequestType from './ItemRequestType'
import { IRequestType, ITreeItem } from '@elastic-suite/gally-admin-shared'
import FormControl from '../form/FormControl'
import { FormHelperText, InputLabel } from '@mui/material'
import InfoTooltip from '../form/InfoTooltip'
import IonIcon from '../IonIcon/IonIcon'
import TextFieldTags from '../form/TextFieldTags'
import TreeSelector from '../form/TreeSelector'

const CustomRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.colors.neutral[200],
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  lineHeight: '18px',
}))

const CustomProp = ['multiVal']
const CustomFirstSelected = styled('div', {
  shouldForwardProp: (prop: string) => !CustomProp.includes(prop),
})<{ multiVal: boolean }>(({ theme, multiVal }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
  '::before': {
    content: "''",
    position: 'absolute',
    border: '1px dotted',
    height: '41px',
    width: '24px',
    borderRight: 'none',
    borderTop: 'none',
    top: '-32px',
    left: '-24px',
  },
  ...(!multiVal && {
    '::after': {
      content: "''",
      position: 'absolute',
      border: '1px dotted',
      height: `calc(100% + 30px)`,
      width: '24px',
      borderRight: 'none',
      borderTop: 'none',
      left: '-24px',
      top: '10px',
    },
  }),
}))

const CustomSelected = styled('div', {
  shouldForwardProp: (prop: string) => !CustomProp.includes(prop),
})<{ multiVal: boolean }>(({ theme, multiVal }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
  ...(multiVal && {
    '::after': {
      content: "''",
      position: 'absolute',
      border: '1px dotted',
      height: `calc(100% + 33px)`,
      width: '24px',
      borderRight: 'none',
      borderTop: 'none',
      top: '9px',
      left: '-24px',
    },
  }),
}))

export interface ITextFIeldTagsForm {
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  helperText?: ReactNode
  placeholder?: string
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  required?: boolean
}

interface IProps extends ITextFIeldTagsForm {
  data: IRequestType[]
  // eslint-disable-next-line
  onChange: (value: any) => void // il  y a problème de tipage dans le compo DropDown
  multiValue: number[] | []
  onChangeSelectAll: (idItem: string) => void
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  setValCategories: (value: ITreeItem[], event: SyntheticEvent) => void
  onRemoveSelect: (value: number) => void
  onChangeValTags: (value: [string], idItem: string) => void
  valTags: { id: string; data: string[] }[]
  width?: number
}

function RequestType(props: IProps): JSX.Element {
  const {
    data,
    onChange,
    multiValue,
    disabled,
    required,
    error,
    fullWidth,
    helperText,
    helperIcon,
    label,
    margin,
    infoTooltip,
    valTags,
    onChangeValTags,
    ...restProps
  } = props

  return (
    <FormControl error={error} fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <div style={{ marginBottom: '24px' }}>
          <InputLabel shrink required={required}>
            {label}
            {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
          </InputLabel>
        </div>
      )}
      <CustomRoot>
        <DropDown
          placeholder={
            data.find((item) => item.isSelected) ? '' : 'Add request type'
          }
          multiple
          onChange={onChange}
          value={multiValue}
          options={data.map((item) => ({ ...item, disabled: undefined }))}
        />
        {data
          .filter((item) => item.isSelected)
          .map((item, key) => {
            let multiVal = key + 1 < multiValue.length
            let CustomDiv = CustomSelected

            if (key === 0) {
              multiVal = multiValue.length === 1
              CustomDiv = CustomFirstSelected
            }

            // eslint-disable-next-line
            let props: any = { ...restProps, data: item }

            if (item.type === 'tags' || item.type === 'products') {
              const value = valTags.find((valTag) => valTag.id === item.id)
              props.Component = TextFieldTags
              props.onChange = onChangeValTags
              props.dataCategories = undefined
              props.disabled = item.disabled
              props.placeholder = item.label
              props.disabledValue = item.labelIsAll
              props.value = value ? value.data : []
              props.idItem = item.id
            }

            if (item.type === 'categories') {
              props.Component = TreeSelector
              props.multiple = true
              props.value = item.disabled ? [] : restProps.valCategories
              props.onChange = restProps.setValCategories
              props.disabled = item.disabled
              props.placeholder = item.disabled ? item.labelIsAll : ''
            }

            return (
              <CustomDiv key={item.id} multiVal={multiVal}>
                <ItemRequestType {...props} />
              </CustomDiv>
            )
          })}
      </CustomRoot>
      {Boolean(helperText) && (
        <FormHelperText error={error}>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon as string}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default RequestType
