import React, { CSSProperties, createContext, ForwardedRef, PropsWithChildren, useEffect, useRef, useState  } from "react"
import Button from "../buttons/Button"

interface IControlFormError {
  formRef: ForwardedRef<HTMLFormElement>,
  formIsValid: boolean,
  showAllErrors: boolean
}
const useControlFormError = (): IControlFormError => {
  const formRef = useRef<HTMLFormElement>(null)
  const [formIsValid, setFormIsValid] = useState(false)
  const [showAllErrors, setShowAllErrors] = useState(true)

  useEffect(() => {
    console.log("Montage du formulaire")
    const mutationObserver = new MutationObserver((mutations) => {
      setFormIsValid(Boolean(formRef.current?.checkValidity()))
    })

    mutationObserver.observe(formRef.current as Node, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => {
      console.log("Démontage du formulaire")
      mutationObserver.disconnect()
    }
  }, [formRef.current])

  return {formRef, formIsValid, showAllErrors}
}

interface IFormProps extends PropsWithChildren {
  onSubmit: (formIsValid: boolean) => void
  submitButtonText: string
  style?: CSSProperties
}

export const FormContext = createContext<boolean>(false)

export default function Form({style, submitButtonText, onSubmit, children}: IFormProps): JSX.Element {
  const {formRef, formIsValid, showAllErrors} = useControlFormError()
  const handleClickButton = (): void => {
    onSubmit(formIsValid)

    // if(formIsValid){
    // } else {
    //   alert("NON VALIDE")
    // }
  }

  return <FormContext.Provider value={showAllErrors}>
    <form ref={formRef} style={style}>
      {children}

      <Button
          onClick={handleClickButton}
        >
          {submitButtonText}
      </Button>
    </form>
  </FormContext.Provider>
}
