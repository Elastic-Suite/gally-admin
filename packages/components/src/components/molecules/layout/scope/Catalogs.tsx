import React from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import {
  ICatalog,
  IHydraResponse,
  ITabContentProps,
  getUniqueLocalName,
} from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../../utils/testIds'

import TitleScope from '../../../atoms/scope/TitleScope'
import NbActiveLocales from '../../../atoms/scope/NbActiveLocales'
import Language from '../../../atoms/scope/Language'

const CustomFullRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

const CustomNbCatalogs = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
  lineHeight: '18px',
  fontSize: '12px',
  fontWeight: '400',
  fontFamily: 'var(--gally-font)',
}))

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridGap: theme.spacing(4),
  gridTemplateColumns: 'repeat(3,1fr)',
}))

const CustomCatalogs = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid #E2E6F3',
  borderRadius: 8,
  gap: theme.spacing(3),
}))

interface IProps extends ITabContentProps {
  content: IHydraResponse<ICatalog>
}

function Catalogs({ content }: IProps): JSX.Element {
  const { t } = useTranslation()
  return (
    <CustomFullRoot>
      <CustomNbCatalogs>
        {content.member.length}{' '}
        {t('catalog.catalog', { count: content.member.length })}
      </CustomNbCatalogs>
      <CustomRoot>
        {content.member.map((item: ICatalog, key: number) => (
          <CustomCatalogs
            data-testid={generateTestId(TestId.CATALOGS, item.code)}
            key={item.name}
          >
            <TitleScope name={item.name} />
            <NbActiveLocales number={getUniqueLocalName(item).length} />
            <Language
              order={key}
              language={getUniqueLocalName(item)}
              content={content.member}
              limit
            />
          </CustomCatalogs>
        ))}
      </CustomRoot>
    </CustomFullRoot>
  )
}

export default Catalogs
