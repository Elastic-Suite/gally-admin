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
  replacementErrorsMessages?: Record<string, string>
}
export interface IFormErrorProps {
  error: boolean
  helperIcon?: string
  helperText?: string
  onChange: IOnChange
  ref?: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
}

export function useFormError(
  onChange: IOnChange,
  value: unknown,
  showError = false,
  validator?: IValidator,
  disabled = false,
  replacementErrorsMessages?: Record<string, string>
): [IFormErrorProps, Dispatch<SetStateAction<string>>] {
  const [error, setError] = useState('')
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const { t } = useTranslation('common')
  const [verify, setVerify] = useState(false)

  const validate = useCallback(
    (value: unknown, event?: SyntheticEvent, targetRef?: boolean): boolean => {
      let error = null
      if (validator) {
        error = validator(value, event)
        ref.current?.setCustomValidity(error)
      }
      if (
        (error === null || error === '') &&
        (event?.target || (targetRef && ref.current))
      ) {
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
    if (!verify) {
      validate(value, undefined, true)
    }
  }, [validate, value, verify])

  const handleChange = useCallback(
    (value: unknown, event?: SyntheticEvent): void => {
      if (!verify) setVerify(true)
      validate(value, event)
      if (onChange) {
        onChange(value, event)
      }
    },
    [onChange, validate, verify]
  )

  return useMemo(() => {
    const props: IFormErrorProps = {
      error: disabled ? false : showError ? Boolean(error) : false,
      onChange: handleChange,
      ref,
    }
    if (disabled) {
      props.helperIcon = ''
      props.helperText = ''
    } else if (error && showError) {
      props.helperIcon = 'close'
      props.helperText = t(
        `formError.${replacementErrorsMessages?.[error] || error}`
      )
    }
    return [
      props,
      (error: string): void => {
        setError(error)
        ref.current?.setCustomValidity(error)
      },
    ]
  }, [error, handleChange, t, disabled, showError, replacementErrorsMessages])
}
