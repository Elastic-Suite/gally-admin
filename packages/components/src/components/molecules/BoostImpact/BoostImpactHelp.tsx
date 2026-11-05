import React from 'react'
import { styled } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import PopIn from '../../atoms/modals/PopIn'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import Alert from '../../atoms/Alert/Alert'
import { userGuideUrl } from '../../../constants/help'
import BoostImpactChart from './BoostImpactChart'

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.palette.colors.neutral[900],
  fontSize: '14px',
  lineHeight: '20px',
}))

const Title = styled('h2')({
  margin: '8px 0 24px',
  fontSize: '20px',
  fontWeight: 600,
  textAlign: 'center',
})

const Text = styled('p')({
  margin: '0 0 12px',
  '&:last-of-type': {
    marginBottom: '24px',
  },
  alignSelf: 'stretch',
})

const Footer = styled('p')({
  margin: '24px 0 0',
  alignSelf: 'stretch',
})

const UserGuideLink = styled('a')(({ theme }) => ({
  color: 'inherit',
  fontWeight: 600,
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}))

const Trigger = styled('button')(({ theme }) => ({
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '12px',
  color: 'inherit',
  textDecoration: 'underline',
  '&:hover, &:focus-visible': {
    color: theme.palette.colors.neutral[900],
  },
}))

interface IProps {
  textKey: string
  options: IOptions<string>
}

function BoostImpactHelp({ textKey, options }: IProps): JSX.Element {
  const { t } = useTranslation('boost')

  return (
    <PopIn
      triggerElement={
        <Alert variant="info" mb={0} closable={false}>
          <Trigger type="button">
            {t('boostConfig.boostImpactHelp.link')}
          </Trigger>
        </Alert>
      }
      position="center"
      boxStyle={{ cursor: 'pointer' }}
      styles={{ paper: { width: '640px', maxWidth: '95vw' } }}
    >
      <Content>
        <IonIcon name="informationCircle" style={{ fontSize: '40px' }} />
        <Title>{t('boostConfig.boostImpactHelp.title')}</Title>
        {t(textKey)
          .split('\n')
          .map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        <BoostImpactChart options={options} />
        <Footer>
          {t('boostConfig.boostImpactHelp.subtext')}{' '}
          <UserGuideLink
            href={userGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('boostConfig.boostImpactHelp.userGuide')}
          </UserGuideLink>
        </Footer>
      </Content>
    </PopIn>
  )
}

export default BoostImpactHelp
