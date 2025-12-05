import React, { useContext } from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import {
  DataContentType,
  IFieldGuesserProps,
  IImage,
  ILog,
  IPositionEffect,
  IPrice,
  IProductInfo,
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
import FormatRowArray from '../../molecules/format/FormatRowArray'

import PreviewGridBoostConfiguration from '../../atoms/form/PreviewGridBoostConfiguration/PreviewGridBoostConfiguration'
import Image from '../../atoms/image/Image'
import PositionEffect from '../../atoms/positionEffect/PositionEffect'
import { TestId, generateTestId } from '../../../utils/testIds'
import Logs from '../../molecules/Logs/Logs'

const Box = styled('div')({
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
  const { input, value, field, options, multipleValueFormat, data, name } =
    props
  const { t } = useTranslation('common')
  const language = useAppSelector(selectLanguage)
  const { localizedCatalogWithDefault } = useContext(catalogContext)
  if (value === undefined || value === null) {
    return null
  }

  switch (input) {
    case DataContentType.BOOLEAN: {
      return <Box>{value ? t('filter.yes') : t('filter.no')}</Box>
    }

    case DataContentType.TAG: {
      return <Chip label={value as string} />
    }

    case DataContentType.IMAGE: {
      const image = (
        typeof value === 'string' ? { path: value } : value
      ) as IImage

      return <Image image={image} />
    }

    case DataContentType.SCORE: {
      const score = (
        typeof value === 'number' ? { scoreValue: value } : value
      ) as IScore
      return (
        <Score
          scoreValue={score.scoreValue}
          rounded
          {...score.boostInfos}
          componentId={name}
        />
      )
    }

    case DataContentType.STOCK: {
      if (!value || (value as IStock).status === null) {
        return null
      }
      return <Stock stockStatus={(value as IStock).status} componentId={name} />
    }

    case DataContentType.PRICE: {
      if (!value || (value instanceof Array && value.length < 1)) {
        return null
      }
      const [{ price }] = value as IPrice[]
      return (
        <Price
          price={price}
          countryCode={language}
          currency={localizedCatalogWithDefault.currency}
          componentId={name}
        />
      )
    }

    case DataContentType.OPTGROUP:
    case DataContentType.SELECT: {
      return (
        <Box>
          <ReadableDropDownGuesser
            value={value as string | string[]}
            field={field}
            options={options}
            multipleValueFormat={multipleValueFormat}
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

    case DataContentType.PRODUCTINFO: {
      if (!value) {
        return null
      }
      const { price, stockStatus, productName } = value as IProductInfo
      return (
        <>
          <p style={{ margin: 0 }}> {productName} </p>
          <div style={{ margin: '4px 0' }}>
            {price != null && typeof price !== 'undefined' && (
              <Price
                price={price}
                countryCode={language}
                currency={localizedCatalogWithDefault.currency}
              />
            )}
          </div>
          <Stock stockStatus={stockStatus} />
        </>
      )
    }

    case DataContentType.BOOSTPREVIEW: {
      return <PreviewGridBoostConfiguration currentBoost={data} />
    }

    case DataContentType.POSITIONEFFECT: {
      return <PositionEffect positionEffect={value as IPositionEffect} />
    }

    case DataContentType.LOGS: {
      return <Logs logs={value as ILog[]} />
    }

    default: {
      return value instanceof Array ? (
        <FormatRowArray
          values={value}
          multipleValueFormat={multipleValueFormat}
        />
      ) : (
        <Box
          data-testid={generateTestId(TestId.OTHER_READABLE_FIELD, name)}
          sx={{ display: 'inline-block', width: '100%' }}
          title={value as string}
        >
          {value as string}
        </Box>
      )
    }
  }
}

export default ReadableFieldGuesser
