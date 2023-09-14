import {
  Dispatch,
  ForwardedRef,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from '@elastic-suite/gally-admin-shared'

export type IOnChange = (value: unknown, event?: SyntheticEvent) => void
export type IValidator = (
  value: unknown,
  event?: SyntheticEvent
) => string | null

export interface IFormErrorProps {
  error: boolean
  helperIcon?: string
  helperText?: string
  onChange: IOnChange
}

export function useFormError(
  onChange: IOnChange,
  value: unknown,
  showError = false,
  validator?: IValidator,
  ref?: ForwardedRef<HTMLInputElement>,
  disabled = false,
): [IFormErrorProps, Dispatch<SetStateAction<string>>] {
  const [error, setError] = useState('')
  const { t } = useTranslation('common')

  const validate = useCallback(
    (value: unknown, event?: SyntheticEvent): boolean => {
      let error = null
      if (validator) {
        error = validator(value, event)
        ref.current?.setCustomValidity(error)
      }
      if (error === null && (event?.target || ref.current)) {
        const { validity } = event ? event.target as HTMLInputElement : ref.current
        if (!validity.valid) {
          error = getFormValidityError(validity)
        }
      }
      if (error) {
        setError(error)
      } else {
        setError('')
      }
      return error === null || error === ''
    },
    [ref, validator]
  )

  useEffect(() => {
    validate(value, undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate])

  const handleChange = useCallback(
    (value: unknown, event?: SyntheticEvent): void => {
      validate(value, event)
      if (onChange) {
        onChange(value, event)
      }
    },
    [onChange, validate]
  )

  return useMemo(() => {
    const props: IFormErrorProps = {
      error: showError ? Boolean(error) : false,
      onChange: handleChange,
    }
    if(disabled){
        props.helperIcon = ''
        props.helperText = ''
      }
    else if (error && showError) {
      props.helperIcon = 'close'
      props.helperText = t(`formError.${error}`)
    }
    return [props, setError]
  }, [error, handleChange, t, disabled, showError])
}
