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
  helperText?: string
  helperIcon?: string
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
  } = props

  function updateSelectedDropDown(list: string[] | string): void {
    const newData = (list as string[]).map((item) => {
      const existingRequestType = value.requestTypes.some((it) => {
        return it.requestType === item
      })
      if (existingRequestType) {
        return value.requestTypes.find((it) => it.requestType === item)!
      }
      const limitationType = requestTypesOptions.find(
        (it) => it.value === item
      )?.limitationType

      const requestTypesValue = requestTypesOptions
        .filter((it) => it.limitationType === limitationType)
        .map((it) => it.value)

      const applyToAll = value.requestTypes.find((item) =>
        requestTypesValue.includes(item.requestType)
      )?.applyToAll

      return { requestType: item, applyToAll: Boolean(applyToAll) }
    })
    return onChange({ ...value, requestTypes: newData })
  }

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
      error={error}
    >
      {label || infoTooltip ? (
        <InputLabel shrink sx={{ maxWidth: '90%' }} required={required}>
          {label ? label : null}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      ) : undefined}
      <CustomRoot error={error}>
        <DropDown
          placeholder={value.requestTypes.length !== 0 ? '' : placeholder}
          multiple
          onChange={updateSelectedDropDown}
          value={value.requestTypes.map((item) => item.requestType)}
          options={requestTypesOptions}
        />
        <RequestTypeItem
          value={value}
          onChange={onChange}
          limitationsTypes={limitationsTypes}
          options={options}
          requestTypesOptions={requestTypesOptions}
          categoriesList={categoriesList}
        />
      </CustomRoot>
      {Boolean(helperText) && (
        <FormHelperText>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default RequestType
