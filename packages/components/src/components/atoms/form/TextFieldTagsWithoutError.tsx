import React, {
  FocusEvent,
  FormEvent,
  ForwardedRef,
  forwardRef,
  useMemo,
  useState,
} from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputTextWithoutError from './InputTextWithoutError'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'
import { ITextFieldTagsForm } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'

const colorOfBorderTextFieldTagsInputInit = '#e2e6f3'
const colorOfBorderTextFieldTagsInputError = '#A02213'
const colorOfBorderTextFieldTagsInputHover = '#b5b9d9'
const colorOfBorderTextFieldTagsInputFocus = '#424880'

const customRootTextFieldTagsProps = ['disabled', 'error', 'focus']
const CustomRootTextFieldTags = styled('div', {
  shouldForwardProp: (prop: string) =>
    !customRootTextFieldTagsProps.includes(prop),
})<{ disabled?: boolean; error?: boolean; focus?: boolean }>(
  ({ theme, disabled, error, focus }) => ({
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: '1px solid',
    minWidth: '350px',
    maxWidth: '650px',
    // borderColor: theme.palette.colors.neutral[600],
    boxSizing: 'border-box',
    background: theme.palette.colors.white,
    position: 'relative',
    gap: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: disabled ? '40px' : '54px',
    ...(disabled && {
      paddingTop: '1px',
      paddingBottom: '1px',
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      borderColor: theme.palette.colors.neutral[300],
      color: theme.palette.colors.neutral['500'],
      WebkitTextFillColor: theme.palette.colors.neutral['500'],
      background: theme.palette.colors.neutral[300],
      width: 'auto',
      maxWidth: '350px',
      minWidth: '180px',
    }),
    transition: 'all 400ms',
    borderColor: error
      ? colorOfBorderTextFieldTagsInputError
      : colorOfBorderTextFieldTagsInputInit,
    ...(focus && {
      borderColor: colorOfBorderTextFieldTagsInputFocus,
    }),
    ...(!error && {
      '&:hover': {
        borderColor: colorOfBorderTextFieldTagsInputHover,
      },
    }),
  })
)

const CustomTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
}))

const CustomFormTextFieldTags = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const CustomInputTextTextFieldTags = styled(InputTextWithoutError)({
  minWidth: 'auto',
  width: '146px',
  border: 'none',
  background: 'inherit',
  '&.MuiInputBase-root': { minHeight: 0, paddingLeft: '8px' },
})

const CustomCloseTagsByOperator = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '-5px',
  top: '-5px',
  borderRadius: '50%',
  background: theme.palette.colors.neutral[600],
  color: 'white',
  display: 'flex',
  padding: theme.spacing(0.5),
  zIndex: '9',
  cursor: 'pointer',
}))

export interface ITextFieldTag extends Omit<ITextFieldTagsForm, 'options'> {
  value?: string[]
  withCleanButton?: boolean
  onChange?: (value: string[]) => void
  onRemoveItem?: () => void
  dataTestId?: string
}

function TextFieldTagsWithoutError(
  props: ITextFieldTag,
  ref?: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const {
    value: inputValue,
    onChange,
    onRemoveItem,
    disabled,
    required,
    error,
    fullWidth,
    helperText,
    helperIcon,
    label,
    margin,
    infoTooltip,
    placeholder,
    size,
    disabledValue,
    withCleanButton,
    dataTestId,
  } = props

  const { t } = useTranslation('common')

  const [val, setVal] = useState<string>('')

  function manageTags(
    key?: number,
    event?:
      | FormEvent<HTMLFormElement>
      | FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>
  ): void | null {
    if (!value || !onChange) {
      return null
    }
    if (event) {
      event.preventDefault()
      if (val === undefined || val.trim() === '') {
        return null
      }
      const newTags = value.concat([val])
      setVal('')
      return onChange(newTags)
    }

    const newTags = value.filter((_, keyValue) => key !== keyValue)
    return onChange(newTags)
  }

  const [focus, setFocus] = useState(false)

  const value = useMemo(
    () => inputValue.filter((el) => el !== null),
    [inputValue]
  )

  function onBlurInputTextFieldTags(
    e: FocusEvent<HTMLInputElement, Element>
  ): void {
    manageTags(undefined, e)
    setFocus(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      {withCleanButton === true && (
        <CustomCloseTagsByOperator
          data-testid={dataTestId ? `${dataTestId}CleanButton` : null}
          onClick={(): void => {
            if (value.length > 0) {
              onChange([])
            }
          }}
        >
          <IonIcon name="close" style={{ fontSize: 14, padding: '0px' }} />
        </CustomCloseTagsByOperator>
      )}

      <FormControl error={error} fullWidth={fullWidth} margin={margin}>
        {Boolean(label || infoTooltip) && (
          <div style={{ marginBottom: '4px' }}>
            <InputLabel shrink required={required}>
              {label}
              {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
            </InputLabel>
          </div>
        )}
        <CustomRootTextFieldTags
          disabled={disabled}
          focus={focus}
          error={error}
        >
          {onRemoveItem ? (
            <CustomCloseTagsByOperator onClick={onRemoveItem}>
              <IonIcon name="close" style={{ fontSize: 14, padding: '0px' }} />
            </CustomCloseTagsByOperator>
          ) : null}
          <CustomTags>
            {disabled || !value ? (
              <Chip disabled label={disabledValue} />
            ) : (
              value
                .filter((it) => it)
                .map((item: string, key: number) => {
                  return disabled ? (
                    // eslint-disable-next-line react/no-array-index-key
                    <Chip disabled key={key} label={disabledValue} />
                  ) : (
                    <Chip
                      // eslint-disable-next-line react/no-array-index-key
                      key={key}
                      label={item}
                      onDelete={(): void | null => manageTags(key)}
                    />
                  )
                })
            )}
            {!disabled && (
              <CustomFormTextFieldTags>
                <CustomInputTextTextFieldTags
                  onFocus={(): void => {
                    if (!error) {
                      setFocus(true)
                    }
                  }}
                  onBlur={(e): void => onBlurInputTextFieldTags(e)}
                  value={val}
                  size={size}
                  placeholder={
                    placeholder ?? t('placeholder.default.textFieldTags')
                  }
                  onChange={(value): void => setVal(value as string)}
                  onKeyDown={(event): void => {
                    if (event.code === 'Enter') manageTags(undefined, event)
                  }}
                  inputRef={ref}
                  dataTestId={dataTestId ? `${dataTestId}InputText` : null}
                />
              </CustomFormTextFieldTags>
            )}
          </CustomTags>
        </CustomRootTextFieldTags>
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
    </div>
  )
}

export default forwardRef<HTMLInputElement, ITextFieldTag>(
  TextFieldTagsWithoutError
)
