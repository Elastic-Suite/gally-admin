import React from 'react'
import { Grid, Paper, styled } from '@mui/material'
import { useTranslation } from 'next-i18next'
import {
  CustomNoTopProduct,
  SearchResult,
  SearchTitle,
} from '../Merchandize/SearchBar/Search.styled'

const PaperStyled = styled(Paper)(() => ({
  display: 'flex',
}))

const GridStyled = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}))

interface IProps {
  nbResults: number
  nbTopProducts: number
}

export default function MerchandiseBar(props: IProps): JSX.Element {
  const { nbResults, nbTopProducts } = props
  const { t } = useTranslation('categories')

  const value = {
    value: nbResults + nbTopProducts,
    result: t('searchBar.results', { count: nbResults }),
  }

  const result = t('searchBarResult', { value })

  const valuePinned = {
    value: nbTopProducts,
    result: t('pinned.results', { count: nbTopProducts }),
  }
  const resultPinned = t('searchBarResult', { value: valuePinned })

  const hasProduct = Boolean(nbTopProducts + nbResults)

  return (
    <PaperStyled variant="outlined">
      <GridStyled container direction="column">
        <SearchTitle>{t('searchBar.title')}</SearchTitle>
        <SearchResult>
          {!hasProduct ? (
            <CustomNoTopProduct>{t('noProductSearch')}</CustomNoTopProduct>
          ) : (
            <>
              {result} {` (${resultPinned})`}
            </>
          )}
        </SearchResult>
      </GridStyled>
    </PaperStyled>
  )
}
