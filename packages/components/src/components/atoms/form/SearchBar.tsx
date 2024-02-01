import { InputAdornment } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import React, { FormEvent } from 'react'
import InputTextError from './InputTextError'

export default function SearchBar({
  value,
  onChange,
  onResearch,
  placeholder,
  label,
}: {
  value: string
  onChange: (value: string) => void
  onResearch: () => void
  placeholder: string
  label: string
}): JSX.Element {
  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()
    onResearch()
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputTextError
        label={label}
        value={value}
        onChange={(value: string | number): void => onChange(value.toString())}
        placeholder={placeholder}
        endAdornment={
          <InputAdornment
            position="end"
            onClick={onResearch}
            sx={{ cursor: 'pointer' }}
          >
            <IonIcon name="search" />
          </InputAdornment>
        }
        showError
        required
      />
    </form>
  )
}
