import React from 'react'

import { IExpansions } from '@elastic-suite/gally-admin-shared'

import { FormHelperText, IconButton, InputLabel } from '@mui/material'
import InfoTooltip from './InfoTooltip'
import IonIcon from '../IonIcon/IonIcon'
import { StyledFormControl } from './InputText.styled'
import Button from '../buttons/Button'
import InputText from './InputText'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import TextFieldTagsError from './TextFieldTagsError'

const CustomPropError = ['error']
const CustomRoot = styled('div', {
  shouldForwardProp: (prop: string) => !CustomPropError.includes(prop),
})<{ error: boolean }>(({ theme, error }) => ({
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  lineHeight: '18px',
  padding: theme.spacing(2),
  border: '1px solid',
  borderRadius: theme.spacing(1),
  borderColor: error
    ? theme.palette.colors.primary[700]
    : theme.palette.colors.neutral[300],
  marginTop: theme.spacing(0.5),
  width: 'fit-content',
  '& .MuiFormLabel-root': {
    fontWeight: 500,
    color: theme.palette.colors.neutral[600],
  },
}))

export interface IProps {
  value: IExpansions
  onChange?: (value: IExpansions) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  infoTooltip?: string
  placeholder?: string
  error?: boolean
  helperText?: string
  helperIcon?: string
  showError?: boolean
}

interface IExpansionsFormatted {
  id: number | string
  referenceTerm: string
  terms: string[]
}

function iExpansionsFormattedToIExpansions(
  expansions: IExpansionsFormatted[]
): IExpansions {
  return expansions.map((expansion) => {
    const expansionItem =
      typeof expansion.id === 'string' ? { '@id': expansion.id } : {}
    return {
      ...expansionItem,
      referenceTerm: expansion.referenceTerm,
      terms: expansion.terms.map((term) => ({ term })),
    }
  })
}

function Expansion(props: IProps): JSX.Element {
  const {
    value,
    onChange,
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
  } = props

  if (value.length === 0) {
    onChange([{ referenceTerm: '', terms: [] }])
  }

  const { t } = useTranslation('thesaurus')
  let lastExpansionId = 0
  const expansions: IExpansionsFormatted[] =
    value && value instanceof Array && value.length > 0
      ? value.map((expansion) => ({
          id: expansion['@id'] ?? lastExpansionId++,
          referenceTerm: expansion.referenceTerm,
          terms: expansion.terms.map((term) => term.term),
        }))
      : []

  function addExpansion(): void {
    const expansionsUpdated = [...expansions]
    if (
      expansionsUpdated.length === 0 ||
      !(
        expansionsUpdated[expansionsUpdated.length - 1].referenceTerm === '' &&
        expansionsUpdated[expansionsUpdated.length - 1].terms.toString() ===
          [].toString()
      )
    ) {
      expansionsUpdated.push({
        id: lastExpansionId++,
        referenceTerm: '',
        terms: [],
      })
    }

    return onChange(iExpansionsFormattedToIExpansions(expansionsUpdated))
  }

  function updateTerms(
    expansionId: string | number,
    referenceTerm: string,
    terms: string[]
  ): void {
    const expansionsUpdated = [...expansions]
    const index = expansionsUpdated.findIndex(
      (expansionsUpdated) => expansionsUpdated.id === expansionId
    )
    if (index >= 0) {
      expansionsUpdated[index].terms = terms
      expansionsUpdated[index].referenceTerm = referenceTerm
    }
    return onChange(iExpansionsFormattedToIExpansions(expansionsUpdated))
  }

  function removeTerms(expansionId: string | number): void {
    const expansionsUpdated = [...expansions]
    const index = expansionsUpdated.findIndex(
      (expansion) => expansion.id === expansionId
    )

    if (index >= 0) {
      expansionsUpdated.splice(index, 1)
    }

    return onChange(iExpansionsFormattedToIExpansions(expansionsUpdated))
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
      <CustomRoot error={false}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            marginBottom: '24px',
          }}
        >
          {expansions.map((expansion) => (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              key={expansion.id}
            >
              <div
                style={{ position: 'relative', display: 'flex', gap: '32px' }}
              >
                <InputText
                  required
                  label={t('reference term')}
                  placeholder={t('reference term')}
                  value={expansion.referenceTerm}
                  onChange={(value): void => {
                    updateTerms(expansion.id, value as string, expansion.terms)
                  }}
                  showError={showError}
                />
                <TextFieldTagsError
                  required
                  label={t('expansion terms')}
                  fullWidth={fullWidth}
                  onChange={(terms): void => {
                    updateTerms(expansion.id, expansion.referenceTerm, terms)
                  }}
                  value={expansion.terms}
                  placeholder={placeholder}
                  additionalValidator={(value: string[]): string => {
                    if (value.length !== [...new Set(value)].length)
                      return 'expansionTermsDuplicate'
                    return ''
                  }}
                  showError={showError}
                />
              </div>
              <IconButton
                onClick={(): void => removeTerms(expansion.id)}
                style={{ margin: '24px 0 0 8px' }}
              >
                <IonIcon
                  style={{ fontSize: '18px', color: '#424880' }}
                  name="trash-outline"
                />
              </IconButton>
            </div>
          ))}
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'right', marginRight: 44 }}
        >
          <Button
            size="large"
            display="secondary"
            endIcon={<IonIcon name="add" style={{ fontSize: 24 }} />}
            onClick={(): void => addExpansion()}
          >
            {t('add')}
          </Button>
        </div>
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

export default Expansion
