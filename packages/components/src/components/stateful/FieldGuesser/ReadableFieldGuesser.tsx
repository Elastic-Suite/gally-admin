import React, { useContext } from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import {
  DataContentType,
  IFieldGuesserProps,
  IPrice,
  IScore,
  IStock,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'
import { selectLanguage, useAppSelector } from '../../../store'

import Chip from '../../atoms/Chip/Chip'
import Score from '../../atoms/score/Score'
import Stock from '../../atoms/stock/Stock'
import Price from '../../atoms/price/Price'
import Link from 'next/link'
import ReadableDropDownGuesser from './ReadableDropDownGuesser'

const Image = styled('img')({
  height: 80,
  width: 80,
})

const Box = styled('div')({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const CustomA = styled('a')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
}))

function ReadableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { input, value, field, options } = props
  const { t } = useTranslation('common')
  const language = useAppSelector(selectLanguage)
  const { localizedCatalogWithDefault } = useContext(catalogContext)

  if (value === undefined || value === null) {
    return null
  }

  switch (input) {
    case DataContentType.BOOLEAN: {
      return <Box>{t(Boolean(input).toString())}</Box>
    }

    case DataContentType.TAG: {
      return <Chip label={value as string} />
    }

    case DataContentType.IMAGE: {
      return <Image alt={t('field.productImage')} src={value as string} />
    }

    case DataContentType.SCORE: {
      const score = { scoreValue: value } as IScore
      return <Score scoreValue={score.scoreValue} />
    }

    case DataContentType.STOCK: {
      return <Stock stockStatus={(value as IStock).status} />
    }

    case DataContentType.PRICE: {
      if (!value) {
        return null
      }
      const [{ price }] = value as IPrice[]
      return (
        <Price
          price={price}
          countryCode={language}
          currency={localizedCatalogWithDefault.currency}
        />
      )
    }

    case DataContentType.SELECT: {
      return (
        <Box>
          <ReadableDropDownGuesser
            value={value as string | string[]}
            field={field}
            options={options}
          />
        </Box>
      )
    }

    case DataContentType.BUTTON: {
      return (
        <Box>
          <Link href={value as string} legacyBehavior passHref>
            <CustomA>{t('Edit')}</CustomA>
          </Link>
        </Box>
      )
    }

    default: {
      return <Box>{value as string}</Box>
    }
  }
}

export default ReadableFieldGuesser
