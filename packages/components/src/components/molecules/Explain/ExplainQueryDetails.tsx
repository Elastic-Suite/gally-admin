import React, { CSSProperties, PropsWithChildren } from 'react'
import Button from '../../atoms/buttons/Button'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import Popin from '../../atoms/modals/PopIn'
import { JSONTree } from 'react-json-tree'
import { IconButton, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

const JSONTreeTheme = {
  extend: {
    scheme: 'gally theme',
    author: 'gally',
    base00: '#ffffff',
    base01: '#F4F7FF',
    base02: '#E2E6F3',
    base03: '#8187B9',
    base04: '#424880',
    base05: '#2F3674',
    base06: '#151A47',
    base07: '#f1efee',
    base08: '#ED7465',
    base09: '#E64733',
    base0A: '#d5911a',
    base0B: '#70be54',
    base0C: '#00ad9c',
    base0D: '#407ee7',
    base0E: '#6666ea',
    base0F: '#c33ff3',
  },
  tree: {
    fontFamily: 'Inter',
    fontSize: '12px',
    flex: '1',
    overflow: 'auto',
    paddingLeft: '5px',
    margin: 0,
  },
}

const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
}

const sharedStyle = { padding: '16px' }
const customDialogStyles = {
  paper: {
    height: '100%',
    maxHeight: '100%',
    width: '33%',
    borderRadius: '0px',
    boxShadow: 'none',
  },
  content: { marginTop: '16px', padding: '0 16px 16px 16px' },
  title: sharedStyle,
  actions: sharedStyle,
}

function TitleTypography({ children }: PropsWithChildren): JSX.Element {
  return (
    <Typography
      fontSize="12px"
      color="#424880"
      marginBottom="4px"
      lineHeight="18px"
    >
      {children}
    </Typography>
  )
}

interface IProps {
  index: string
  query: JSON
  boxStyle?: CSSProperties
}

function ExplainQueryDetails({ index, query, boxStyle }: IProps): JSX.Element {
  const { t } = useTranslation('explain')

  const ButtonCopyToClipBoard = (
    <Button
      display="secondary"
      onClick={(): void => copyToClipboard(JSON.stringify(query))}
    >
      <IonIcon name="copy-outline" style={{ fontSize: 24 }} />
      <span style={{ marginLeft: 8 }}>{t('Copy request')}</span>
    </Button>
  )
  const codeSlashButton = (
    <IconButton
      style={{
        background: 'linear-gradient(47deg, #E64733 0%, #ED7465 100%)',
        boxShadow:
          '4px 4px 14px 0px rgba(255, 231, 228, 0.50), 0px 16px 16px 0px rgba(243, 151, 140, 0.20), 0px -8px 8px 0px rgba(255, 231, 228, 0.20)',
        padding: '12px',
      }}
    >
      <IonIcon
        name="code-slash"
        style={{
          color: '#fff',
          width: '24px',
          height: '24px',
        }}
      />
    </IconButton>
  )

  return (
    <Popin
      triggerElement={codeSlashButton}
      titlePopIn={t('Query details')}
      actions={ButtonCopyToClipBoard}
      styles={customDialogStyles}
      boxStyle={boxStyle}
      position="right"
    >
      <TitleTypography>{t('query.popin.title')}</TitleTypography>
      <Typography
        fontSize="14px"
        color="#151A47"
        fontStyle="normal"
        fontWeight="500"
        lineHeight="20px"
        marginBottom="16px"
      >
        {index}
      </Typography>
      <TitleTypography>{t('query.popin.request')}</TitleTypography>
      {query ? (
        <div>
          <JSONTree
            data={query}
            theme={JSONTreeTheme}
            shouldExpandNodeInitially={(): boolean => true}
          />
        </div>
      ) : null}
    </Popin>
  )
}

export default ExplainQueryDetails
