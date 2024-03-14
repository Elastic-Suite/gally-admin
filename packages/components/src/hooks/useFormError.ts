import {
  Dispatch,
  ForwardedRef,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from '@elastic-suite/gally-admin-shared'

export type IOnChange = (value: unknown, event?: SyntheticEvent) => void
export type IValidator = (
  value: unknown,
  event?: SyntheticEvent
) => string | null

export interface IFieldErrorProps {
  showError?: boolean
  additionalValidator?: IValidator
}
export interface IFormErrorProps {
  error: boolean
  helperIcon?: string
  helperText?: string
  onChange: IOnChange
  ref?: ForwardedRef<HTMLInputElement>
}

export function useFormError(
  onChange: IOnChange,
  value: unknown,
  showError = false,
  validator?: IValidator,
  disabled = false
): [IFormErrorProps, Dispatch<SetStateAction<string>>] {
  const [error, setError] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const { t } = useTranslation('common')

  const validate = useCallback(
    (value: unknown, event?: SyntheticEvent, targetRef?: boolean): boolean => {
      let error = null
      if (validator) {
        error = validator(value, event)
        ref.current?.setCustomValidity(error)
      }
      if ((error === null || error === '') && (event?.target || targetRef)) {
        const validity =
          targetRef && ref.current
            ? ref.current.validity
            : (event?.target as HTMLInputElement)?.validity
        if (!validity?.valid) {
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
    validate(value, undefined, true)
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
      ref,
    }
    if (disabled) {
      props.helperIcon = ''
      props.helperText = ''
    } else if (error && showError) {
      props.helperIcon = 'close'
      props.helperText = t(`formError.${error}`)
    }
    return [
      props,
      (error: string): void => {
        setError(error)
        ref.current?.setCustomValidity(error)
      },
    ]
  }, [error, handleChange, t, disabled, showError])
}
