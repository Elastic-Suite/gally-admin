import { useState } from 'react'
import { useLog } from './useLog'

// todo ajouter les tests
export function usePopIn(
  onConfirm?: () => void | Promise<void>
): [boolean, () => void, () => void, () => Promise<void>] {
  const [open, setOpen] = useState(false)
  const log = useLog()

  function handleClickOpen(): void {
    setOpen(true)
  }

  function handleClose(): void {
    setOpen(false)
  }

  async function handleConfirm(): Promise<void> {
    if (typeof onConfirm === 'function') {
      try {
        const result = onConfirm()
        if (result instanceof Promise) {
          return await result
        }
      } catch (error) {
        return log(error)
      }
    }
    setOpen(false)
  }

  return [open, handleClickOpen, handleClose, handleConfirm]
}
