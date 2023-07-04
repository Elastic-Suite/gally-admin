import React from 'react'
import {
  IMetadata,
  firstLetterUppercase,
} from '@elastic-suite/gally-admin-shared'

import { useTranslation } from 'next-i18next'

import DropDown from '../form/DropDown'
import { styled } from '@mui/system'

const CustomBlocEntity = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  background: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1.5),
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(2),
}))

const CustomNameBloc = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontSize: theme.spacing(1.9),
  fontWeight: 'normal',
  lineHeight: '20px',
}))

interface IProps {
  metadatas: IMetadata[]
  fixedFilters: string
  setFixedFilters: (val: Record<string, string>) => void
}

function Metadata(props: IProps): JSX.Element {
  const { metadatas, fixedFilters, setFixedFilters } = props
  const { t } = useTranslation('common')

  const metadataOptions = metadatas?.map((item) => ({
    label: firstLetterUppercase(item.entity),
    value: item.entity,
  }))
  return (
    <CustomBlocEntity>
      <CustomNameBloc>{t('entity')}</CustomNameBloc>
      <DropDown
        options={metadataOptions}
        value={fixedFilters}
        onChange={(e: string): void =>
          setFixedFilters({ 'metadata.entity': e })
        }
      />
    </CustomBlocEntity>
  )
}

export default Metadata
