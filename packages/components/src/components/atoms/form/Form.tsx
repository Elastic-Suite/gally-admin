import React, {
  CSSProperties,
  PropsWithChildren,
  SyntheticEvent,
  createContext,
  forwardRef,
} from 'react'
import Button from '../buttons/Button'
import { useFormValidation } from '../../../hooks/useFormValdation'
interface IFormProps extends PropsWithChildren {
  onSubmit: (event: SyntheticEvent, formIsValid: boolean) => void
  submitButtonText: string
  style?: CSSProperties
}

export const FormContext = createContext<boolean>(false)

function Form({
  style,
  submitButtonText,
  onSubmit,
  children,
}: IFormProps): JSX.Element {
  const { formRef, formIsValid } = useFormValidation()
  const handleSubmit = (event: SyntheticEvent): void =>
    onSubmit(event, formIsValid)

  return (
    <form ref={formRef} style={style}>
      {children}

      <Button sx={{ marginTop: '8px' }} type="submit" onClick={handleSubmit}>
        {submitButtonText}
      </Button>
    </form>
  )
}

export default forwardRef(Form)
