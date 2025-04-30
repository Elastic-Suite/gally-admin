import React from 'react'
import ReadOnlyTable from '../../atoms/ReadOnlyTable/ReadOnlyTable'
import { IRow } from '../../atoms/ReadOnlyTable/ReadOnlyTable.styled'
import { Title } from './SearchTermsTable.styled'
import { useTranslation } from 'next-i18next'

interface ISearchTermsTableProps {
  data: {
    term: string
    session: number
  }[]
}

function SearchTermsTable({ data }: ISearchTermsTableProps): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const header = {
    cells: [
      {
        id: 'terms',
        value: 'Terms',
        style: {
          width: '200px',
        },
      },
      {
        id: 'sessions',
        value: 'Sessions',
        style: {
          width: '200px',
        },
      },
    ],
  }
  const body: IRow[] = data
    .sort((a, b) => b.session - a.session)
    .map(({ term, session }, index) => ({
      id: `row-${index}`,
      cells: [
        {
          id: `term-${index}`,
          value: term,
        },
        {
          id: `session-${index}`,
          value: session,
        },
      ],
    }))

  return (
    <div>
      <Title>{t('searchTermsTableTitle')}</Title>
      <ReadOnlyTable header={header} body={body} />
    </div>
  )
}

export default SearchTermsTable
