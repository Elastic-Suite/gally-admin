import React, { ReactNode } from 'react'
import { styled } from '@mui/system'

import { getCustomScrollBarStyles } from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../../utils/testIds'

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'var(--gally-font)',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderTop: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  '&:first-of-type': {
    borderTop: 0,
  },
}))

const Subtitle = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  fontFamily: 'var(--gally-font)',
  padding: theme.spacing(2),
  paddingBottom: 0,
}))

const Container = styled('div')(({ theme }) => ({
  borderTop: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  overflow: 'auto',
  ...getCustomScrollBarStyles(theme),
  '&:not(:has(div > *))': {
    height: 0,
    borderTop: 0,
  },
}))

const PaddingBox = styled('div')(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(2),
  '&:empty': {
    padding: 0,
  },
}))

interface IProps {
  title?: string
  children?: ReactNode
  subtitle?: string
  componentId?: string
}

function TitleBlock(props: IProps): JSX.Element {
  const { title, children, subtitle, componentId } = props
  return (
    <>
      {Boolean(title) && (
        <Title data-testid={generateTestId(TestId.TITLE_BLOCK, componentId)}>
          {title}
        </Title>
      )}
      {Boolean(children || subtitle) && (
        <Container>
          {Boolean(subtitle) && <Subtitle>{subtitle}</Subtitle>}
          {Boolean(children) && <PaddingBox>{children}</PaddingBox>}
        </Container>
      )}
    </>
  )
}

export default TitleBlock
