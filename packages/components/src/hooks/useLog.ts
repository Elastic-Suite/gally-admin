import { useCallback } from 'react'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import {
  MessageSeverity,
  NetworkError,
  log,
} from '@elastic-suite/gally-admin-shared'

export function useLog(
  severity: MessageSeverity = 'error'
): (error: NetworkError) => void {
  return useCallback(
    (error: NetworkError) =>
      log(error, (message: string) =>
        enqueueSnackbar(message, {
          onShut: closeSnackbar,
          variant: severity,
          preventDuplicate: true,
        })
      ),
    [severity]
  )
}
