import { RefObject, useEffect, useRef, useState } from 'react'

interface IFormValidation {
  formRef: RefObject<HTMLFormElement>
  formIsValid: boolean
}
export const useFormValidation = (): IFormValidation => {
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
