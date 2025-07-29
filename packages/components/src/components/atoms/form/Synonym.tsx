import React, { ReactNode } from 'react'

import { ISynonyms } from '@elastic-suite/gally-admin-shared'
import { FormHelperText, IconButton, InputLabel } from '@mui/material'
import InfoTooltip from './InfoTooltip'
import IonIcon from '../IonIcon/IonIcon'
import { StyledFormControl } from './InputText.styled'
import Button from '../buttons/Button'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import TextFieldTags from './TextFieldTags'
import { TestId, generateTestId } from '../../../utils/testIds'

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
}))

function synonymValidator(terms: string[]): string {
  if (terms.length < 2) return 'synonymTermsSizeInvalid'
  else if (terms.find((term) => term === undefined || term === ''))
    return 'synonymTermsSizeInvalid'
  if (terms.length !== [...new Set(terms)].length)
    return 'synonymTermsDuplicate'
  return ''
}

export interface IProps {
  value: ISynonyms
  onChange?: (value: ISynonyms) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  infoTooltip?: string
  placeholder?: string
  error?: boolean
  showError?: boolean
  helperText?: ReactNode
  helperIcon?: string
  componentId?: string
}

interface ISynonymFormatted {
  id: number | string
  terms: string[]
}

function iSynonymsFormattedToISynonyms(
  synonyms: ISynonymFormatted[]
): ISynonyms {
  return synonyms.map((synonym) => {
    const synonymItem =
      typeof synonym.id === 'string' ? { '@id': synonym.id } : {}
    return {
      ...synonymItem,
      terms: synonym.terms.map((term) => ({ term })),
    }
  })
}

function Synonym(props: IProps): JSX.Element {
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
    showError,
    helperText,
    helperIcon,
    componentId,
  } = props

  if (value.length === 0) {
    onChange([{ terms: [] }])
  }

  const { t } = useTranslation('thesaurus')
  let lastExpansionId = 0
  const synonyms: ISynonymFormatted[] =
    value && value instanceof Array && value.length > 0
      ? value.map((synonym) => ({
          id: synonym['@id'] ?? lastExpansionId++,
          terms: synonym.terms.map((term) => term.term),
        }))
      : []

  function addSynonym(): void {
    const synonymsUpdated = [...synonyms]
    if (
      synonymsUpdated.length === 0 ||
      synonymsUpdated[synonymsUpdated.length - 1].terms.toString() !==
        [].toString()
    ) {
      synonymsUpdated.push({
        id: lastExpansionId++,
        terms: [],
      })
    }

    return onChange(iSynonymsFormattedToISynonyms(synonymsUpdated))
  }

  function updateTerms(synonymId: string | number, terms: string[]): void {
    const synonymsUpdated = [...synonyms]
    const index = synonymsUpdated.findIndex(
      (synonym) => synonym.id === synonymId
    )

    if (index >= 0) {
      synonymsUpdated[index].terms = terms
    }

    return onChange(iSynonymsFormattedToISynonyms(synonymsUpdated))
  }

  function removeTerms(synonymId: string | number): void {
    const synonymsUpdated = [...synonyms]
    const index = synonymsUpdated.findIndex(
      (synonym) => synonym.id === synonymId
    )

    if (index >= 0) {
      synonymsUpdated.splice(index, 1)
    }

    return onChange(iSynonymsFormattedToISynonyms(synonymsUpdated))
  }

  const dataTestId = generateTestId(TestId.SYNONYM, componentId)

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
      error={error}
      data-testid={dataTestId}
    >
      {label || infoTooltip ? (
        <InputLabel shrink sx={{ maxWidth: '90%' }} required={required}>
          {label ? label : null}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      ) : undefined}
      <CustomRoot error={error}>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            flexDirection: 'column',
            marginBottom: '24px',
          }}
        >
          {synonyms.map((synonym) => (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
              key={synonym.id}
              className="synonym"
            >
              <TextFieldTags
                fullWidth={fullWidth}
                showError={showError}
                required
                withCleanButton
                onChange={(terms): void => {
                  updateTerms(synonym.id, terms)
                }}
                value={synonym.terms}
                placeholder={placeholder}
                additionalValidator={synonymValidator}
                componentId={componentId}
              />
              <IconButton
                data-testid={generateTestId(
                  TestId.SYNONYM_REMOVE_BUTTON,
                  componentId
                )}
                onClick={(): void => removeTerms(synonym.id)}
                style={{ marginLeft: 8 }}
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
            onClick={(): void => addSynonym()}
            data-testid={generateTestId(TestId.SYNONYM_ADD_BUTTON, componentId)}
          >
            {t('add')}
          </Button>
        </div>
      </CustomRoot>
      {Boolean(helperText) && (
        <FormHelperText
          error={error}
          data-testid={generateTestId(TestId.HELPER_TEXT, componentId)}
        >
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

export default Synonym
