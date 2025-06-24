import React, {
  CSSProperties,
  ComponentProps,
  SyntheticEvent,
  createContext,
} from 'react'
import Button from '../buttons/Button'
import { useFormValidation } from '../../../hooks/useFormValdation'

interface IFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit: (event: SyntheticEvent, formIsValid: boolean) => void
  submitButtonText?: string
  style?: CSSProperties
}

export const FormContext = createContext<boolean>(false)

function Form({
  style,
  submitButtonText,
  onSubmit,
  children,
  ...formProps
}: IFormProps): JSX.Element {
  const { formRef, formIsValid } = useFormValidation()
  const handleSubmit = (event: SyntheticEvent): void =>
    onSubmit(event, formIsValid)

  return (
    <form
      ref={formRef}
      style={style}
      onSubmit={handleSubmit}
      noValidate
      {...formProps}
    >
      {children}

      {submitButtonText !== undefined && (
        <Button
          style={{ marginTop: '8px' }}
          type="submit"
          componentId="form-submit"
        >
          {submitButtonText}
        </Button>
      )}
    </form>
  )
}

export default Form
