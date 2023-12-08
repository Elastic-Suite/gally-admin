import InputText from './InputText'
import { InputAdornment } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import React, { FormEvent } from 'react'

export default function SearchBar({
  value,
  onChange,
  onResearch,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onResearch: () => void
  placeholder: string
}): JSX.Element {
  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()
    onResearch()
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputText
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
      />
    </form>
  )
}
