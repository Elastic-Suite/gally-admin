import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Button from '../buttons/Button'
import { ButtonProps } from '@mui/material'
import { useTranslation } from 'next-i18next'

interface IProps extends ButtonProps {
  urlRedirection?: string
  children?: ReactNode
}

function BackToLastPage(props: IProps): JSX.Element {
  const { urlRedirection, children, ...btnProps } = props
  const router = useRouter()

  const { t } = useTranslation('common')

  function handleRedirection(): Promise<boolean> | void {
    if (urlRedirection) {
      return router.push(urlRedirection)
    }
    return router.back()
  }

  return (
    <Button
      display="tertiary"
      color="info"
      startIcon={<ion-icon name="arrow-back-outline" />}
      {...btnProps}
      onClick={handleRedirection}
    >
      {children ?? t('back')}
    </Button>
  )
}

export default BackToLastPage
