import React from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/system'
import Button from '../../atoms/buttons/Button'
import Chip from '../../atoms/Chip/Chip'
import { TypographyOptions } from '@mui/material/styles/createTypography'

const ThesaurusCardStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
  background: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  padding: theme.spacing(4),
  '& h4': {
    ...(theme.typography as TypographyOptions).h4,
    color: theme.palette.colors.neutral[900],
    fontFamily: 'var(--gally-font)',
    margin: 0,
  },
}))

const TermsStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  flex: 1,
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}))

interface IProps {
  button: {
    label: string
    url: string
  }
  terms: string[]
  title: string
}

export default function ThesaurusCard({
  button,
  terms,
  title,
}: IProps): JSX.Element {
  const router = useRouter()

  function handleClick(): Promise<boolean> {
    return router.push(button.url)
  }

  return (
    <ThesaurusCardStyled>
      <h4>{title}</h4>
      <TermsStyled>
        {terms.map((term: string) => (
          <Chip key={term} color="primary" label={term} />
        ))}
      </TermsStyled>

      <Button display="secondary" onClick={handleClick} size="large">
        {button.label}
      </Button>
    </ThesaurusCardStyled>
  )
}
