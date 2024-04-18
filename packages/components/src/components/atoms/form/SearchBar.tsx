import { InputAdornment } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import React, { useContext } from 'react'
import InputTextError from './InputTextError'
import { FormIsValidContext } from '../../molecules/FiltersPreviewBoostingTabs/FiltersPreviewBoostingTab'

export default function SearchBar({
  value,
  onChange,
  onResearch,
  placeholder,
  label,
  showError,
}: {
  value: string
  onChange: (value: string) => void
  onResearch: (formIsValid?: boolean) => void
  placeholder: string
  label: string
  showError?: boolean
}): JSX.Element {
  const formIsValid = useContext(FormIsValidContext)

  return (
    <InputTextError
      label={label}
      value={value}
      onChange={(value: string | number): void => onChange(value.toString())}
      placeholder={placeholder}
      endAdornment={
        <InputAdornment
          position="end"
          onClick={(): void => onResearch(formIsValid)}
          sx={{ cursor: 'pointer' }}
        >
          <IonIcon name="search" />
        </InputAdornment>
      }
      showError={showError}
      required
    />
  )
}
