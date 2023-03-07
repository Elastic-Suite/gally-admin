import React, { ReactNode } from 'react'
import { styled } from '@mui/system'
import DropDown from '../form/DropDown'
import RequestTypeItem from './RequestTypeItem'
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
  // data: IRequestType[]
  onChange: (
    description: string,
    value?: string[] | ITreeItem[],
    idItem?: string
  ) => void

  multiValue: number[] | []
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  valTags: { id: string; data: string[] }[]
  width?: number
  requestTypesOptions: any
  dataGeneral: any
  limitationsTypes: any
  textOperatorOptions: any
}

function RequestType(props: IProps): JSX.Element {
  const {
    // data,
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
    requestTypesOptions,
    dataGeneral,
    limitationsTypes,
    textOperatorOptions,
    ...restProps
  } = props

  const selectedOptions = requestTypesOptions.filter((item) =>
    dataGeneral[0].requestTypes.find((it) => it.requestType === item.value)
  )

  const limitationsArray = dataGeneral[0].requestTypes.map((item) => {
    return requestTypesOptions.find((it) => it.value === item.requestType)
  })

  console.log('limitationsArray', limitationsArray)
  console.log('selectedOptions', selectedOptions)
  console.log('multiValue', multiValue)
  console.log('limitationsTypes', limitationsTypes)

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
          placeholder={selectedOptions.length ? '' : 'Add request type'}
          multiple
          onChange={(value: string[] | string): void =>
            onChange('optionsDropdown', value as string[])
          }
          value={selectedOptions.map((item) => item.value)}
          options={requestTypesOptions}
        />
        {limitationsArray.map((item, key) => {
          let multiVal = key + 1 < limitationsArray.length
          let CustomDiv = CustomSelected

          if (key === 0) {
            multiVal = limitationsArray.length === 1
            CustomDiv = CustomFirstSelected
          }

          const requestType = dataGeneral[0].requestTypes.find(
            (it) => it.requestType === item.value
          )

          const limiTationType = limitationsTypes.find(
            (it) => it.value === item.limitation_type
          )

          // console.log('limiTationType', limiTationType)
          // console.log('requestType', requestType)

          const props = {
            Component: TextFieldTags,
            textOperatorOptions: textOperatorOptions,
          }

          return (
            <CustomDiv key={item.id} multiVal={multiVal}>
              <RequestTypeItem
                requestType={requestType}
                limiTationType={limiTationType}
                data={dataGeneral[0][item.limitation_type + 'Limitations']}
                onChange={onChange}
                {...props}
              />
            </CustomDiv>
          )
        })}
        {/* {data
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
              props.onChange = (value: string[]): void =>
                onChange(value, item.id)
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
              props.onChange = onChange
              props.disabled = item.disabled
              props.placeholder = item.disabled ? item.labelIsAll : ''
            }

            return (
              <CustomDiv key={item.id} multiVal={multiVal}>
                <RequestTypeItem {...props} />
              </CustomDiv>
            )
          })} */}
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
