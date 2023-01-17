import React, { useContext } from 'react'
import { Switch } from '@mui/material'
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

function ReadableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { input, value } = props
  const { t } = useTranslation('common')
  const language = useAppSelector(selectLanguage)
  const { localizedCatalogWithDefault } = useContext(catalogContext)

  if (value === undefined || value === null) {
    return null
  }

  switch (input) {
    case DataContentType.BOOLEAN: {
      return <Switch disabled defaultChecked={value as boolean} />
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

    default: {
      return <Box>{value as string}</Box>
    }
  }
}

export default ReadableFieldGuesser
