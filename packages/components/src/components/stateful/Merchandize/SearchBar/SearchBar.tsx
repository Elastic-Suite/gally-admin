import React, { FormEvent } from 'react'
import { Grid, InputAdornment, Paper } from '@mui/material'
import { useTranslation } from 'next-i18next'

import InputTextWithoutError, {
  IInputTextProps,
} from '../../../atoms/form/InputTextWithoutError'
import IonIcon from '../../../atoms/IonIcon/IonIcon'

import { CustomNoTopProduct, SearchResult, SearchTitle } from './Search.styled'

interface IProps extends Omit<IInputTextProps, 'ref'> {
  nbResults: number
  nbTopProducts: number
  sortValue: string
  searchValue: string
  onSearch?: (value: string) => void
  onValSearchOnChange?: (value: string) => void
  isInputAdornmentClickable?: boolean
}

export default function SearchBar(props: IProps): JSX.Element {
  const {
    nbResults,
    nbTopProducts,
    sortValue,
    onSearch,
    searchValue,
    onValSearchOnChange,
    isInputAdornmentClickable,
    ...inputTextProps
  } = props

  const { t } = useTranslation('categories')

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    onSearch(searchValue)
  }

  const value = {
    value:
      sortValue === 'category__position' && !inputTextProps.value
        ? nbResults + nbTopProducts
        : nbResults,
    result: t('searchBar.results', { count: nbResults }),
  }

  const result = t('searchBarResult', { value })

  const valuePinned = {
    value: nbTopProducts,
    result: t('pinned.results', { count: nbTopProducts }),
  }
  const resultPinned = t('searchBarResult', { value: valuePinned })

  function handleClick(): void {
    onSearch(searchValue)
  }

  const hasProduct = Boolean(nbTopProducts + nbResults)

  return (
    <Paper variant="outlined">
      <Grid container justifyContent="space-between" sx={{ padding: '16px' }}>
        <Grid container direction="column" sx={{ width: '100%', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SearchTitle>{t('searchBar.title')}</SearchTitle>
              <SearchResult>
                {!hasProduct ? (
                  <CustomNoTopProduct>
                    {t('noProductSearch')}
                  </CustomNoTopProduct>
                ) : (
                  <>
                    {result}{' '}
                    {sortValue === 'category__position' &&
                      !inputTextProps.value &&
                      `(${resultPinned})`}
                  </>
                )}
              </SearchResult>
            </div>
            <form onSubmit={handleSubmit}>
              <InputTextWithoutError
                id="input-text"
                required={false}
                disabled={false}
                value={searchValue}
                onChange={onValSearchOnChange}
                {...inputTextProps}
                placeholder={t('searchBar.placeholder')}
                endAdornment={
                  <InputAdornment
                    position="end"
                    onClick={isInputAdornmentClickable ? handleClick : null}
                    sx={{
                      cursor: isInputAdornmentClickable ? 'pointer' : '',
                    }}
                  >
                    <IonIcon name="search" />
                  </InputAdornment>
                }
              />
            </form>
          </div>
          {Boolean(
            hasProduct &&
              nbTopProducts === 0 &&
              sortValue === 'category__position'
          ) && (
            <CustomNoTopProduct>{t('labelForPinProduct')}</CustomNoTopProduct>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}
