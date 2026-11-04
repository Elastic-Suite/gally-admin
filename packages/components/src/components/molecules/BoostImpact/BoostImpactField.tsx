import React from 'react'
import { styled } from '@mui/material'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import RadioGroup from '../../atoms/form/RadioGroup'
import BoostImpactHelp from './BoostImpactHelp'

export interface IBoostImpactFieldProps {
  options: IOptions<string>
  value?: string
  helpTextKey: string
  showError?: boolean
  required?: boolean
  onChange: (value: string) => void
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  marginBottom: theme.spacing(1),
  '& > .MuiFormControl-root': {
    marginBottom: 0,
  },
}))

function BoostImpactField({
  options,
  value,
  helpTextKey,
  showError,
  required,
  onChange,
}: IBoostImpactFieldProps): JSX.Element {
  const { t } = useTranslation('boost')

  return (
    <Container>
      <RadioGroup
        options={options}
        value={value || null}
        onChange={onChange}
        label={t('boostConfig.boostImpact')}
        row
        required={required}
        showError={showError}
      />
      <BoostImpactHelp textKey={helpTextKey} options={options} />
    </Container>
  )
}

export default BoostImpactField
