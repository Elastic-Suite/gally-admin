import React from 'react'

import {
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  ITreeItem,
} from '@elastic-suite/gally-admin-shared'

import { CustomRoot } from './RequestTypeItem.styled'
import DropDown from './DropDown'
import RequestTypeItem from './RequestTypeItem'
import { FormHelperText, InputLabel } from '@mui/material'
import InfoTooltip from './InfoTooltip'
import IonIcon from '../IonIcon/IonIcon'
import { StyledFormControl } from './InputText.styled'

export interface IProps {
  value: IRequestType
  onChange: (value: IRequestType) => void
  options: IOptionsTags[]
  limitationsTypes: ILimitationsTypes[]
  requestTypesOptions: IRequestTypesOptions[]
  categoriesList: ITreeItem[]
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  infoTooltip?: string
  placeholder?: string
  error?: boolean
  helperText?: string | string[]
  helperIcon?: string
  showError?: boolean
  componentId?: string
}

function RequestType(props: IProps): JSX.Element {
  const {
    value,
    onChange,
    options,
    limitationsTypes,
    requestTypesOptions,
    categoriesList,
    label,
    required,
    fullWidth,
    margin,
    infoTooltip,
    placeholder,
    error,
    helperText,
    helperIcon,
    showError,
    componentId,
  } = props

  function updateSelectedDropDown(list: string[] | string): void {
    const selectedList = Array.isArray(list) ? list : [list]

    const newRequestTypes = selectedList
      .map((item) => {
        const existingItem = value.requestTypes.find(
          (r) => r.requestType === item
        )
        if (existingItem) return existingItem

        const requestTypeOption = requestTypesOptions.find(
          (opt) => opt.value === item
        )
        if (!requestTypeOption) return null

        const { limitationType } = requestTypeOption
        const linkedRequestTypes = requestTypesOptions.filter(
          (opt) => opt.limitationType === limitationType
        )

        const applyToAll = value.requestTypes
          .filter((r) =>
            linkedRequestTypes.some((linked) => linked.value === r.requestType)
          )
          .every((r) => r.applyToAll)

        return { requestType: item, applyToAll }
      })
      .filter(Boolean)

    const newValue: Record<string, unknown> = {
      ...value,
      requestTypes: newRequestTypes,
    }

    requestTypesOptions.forEach(({ value: optionValue, limitationType }) => {
      const key = `${limitationType}Limitations` as keyof IRequestType
      if (!selectedList.includes(optionValue) && !value[key]) {
        newValue[key] = []
      }
    })

    onChange(newValue as unknown as IRequestType)
  }

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
      error={error}
      className="requestType"
    >
      {label || infoTooltip ? (
        <InputLabel shrink sx={{ maxWidth: '90%' }} required={required}>
          {label ? label : null}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      ) : undefined}
      <CustomRoot error={error}>
        <DropDown
          showError={showError}
          required={required}
          placeholder={value.requestTypes.length !== 0 ? '' : placeholder}
          multiple
          onChange={updateSelectedDropDown}
          value={value.requestTypes.map((item) => item.requestType)}
          options={requestTypesOptions}
          componentId={componentId}
        />
        <RequestTypeItem
          value={value}
          showError={showError}
          onChange={onChange}
          limitationsTypes={limitationsTypes}
          options={options}
          requestTypesOptions={requestTypesOptions}
          categoriesList={categoriesList}
          componentId={componentId}
        />
      </CustomRoot>
      {Boolean(helperText) && (
        <FormHelperText style={{ flexDirection: 'column' }}>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {typeof helperText === 'string'
            ? helperText
            : helperText.map((text) => {
                return <span key={text}>{text}</span>
              })}
        </FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default RequestType
