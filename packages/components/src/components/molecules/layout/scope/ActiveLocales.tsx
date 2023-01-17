import React from 'react'
import { styled } from '@mui/system'
import {
  ICatalog,
  IHydraResponse,
  ITabContentProps,
} from '@elastic-suite/gally-admin-shared'

import TitleScope from '../../../atoms/scope/TitleScope'
import NbActiveLocales from '../../../atoms/scope/NbActiveLocales'
import Language from '../../../atoms/scope/Language'

const CustomRoot = styled('div')(({ theme }) => ({
  width: '671px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid #E2E6F3',
  borderRadius: 8,
}))

interface IProps extends ITabContentProps {
  content: IHydraResponse<ICatalog>
}

function ActiveLocales({ content }: IProps): JSX.Element {
  let languages = []
  for (const hydraContent of content['hydra:member']) {
    for (const localizedCatalogsContent of hydraContent.localizedCatalogs) {
      languages.push(localizedCatalogsContent.localName)
    }
  }
  languages = [...new Set(languages)]

  return (
    <CustomRoot>
      <TitleScope name="Total" />
      <NbActiveLocales number={languages.length} />
      <Language language={languages} limit={false} />
    </CustomRoot>
  )
}

export default ActiveLocales
