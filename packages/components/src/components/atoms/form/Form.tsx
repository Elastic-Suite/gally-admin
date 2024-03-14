import React, {
  CSSProperties,
  PropsWithChildren,
  RefObject,
  createContext,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button from '../buttons/Button'

interface IControlFormError {
  formRef: RefObject<HTMLFormElement>
  formIsValid: boolean
}
const useControlFormError = (): IControlFormError => {
  const formRef = useRef<HTMLFormElement>(null)
  const [formIsValid, setFormIsValid] = useState(false)

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      setFormIsValid(Boolean(formRef.current?.checkValidity()))
    })

    mutationObserver.observe(formRef.current as Node, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => mutationObserver.disconnect()
  }, [formRef])

  return { formRef, formIsValid }
}

interface IFormProps extends PropsWithChildren {
  onSubmit: (formIsValid: boolean) => void
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
  const { formRef, formIsValid } = useControlFormError()
  const handleClickButton = (): void => onSubmit(formIsValid)

  return (
    <form ref={formRef} style={style}>
      {children}

      <Button onClick={handleClickButton}>{submitButtonText}</Button>
    </form>
  )
}

export default forwardRef(Form)
