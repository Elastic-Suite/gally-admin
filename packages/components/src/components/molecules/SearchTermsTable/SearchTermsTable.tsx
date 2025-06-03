import React from 'react'
import ReadOnlyTable from '../../atoms/ReadOnlyTable/ReadOnlyTable'
import { IRow } from '../../atoms/ReadOnlyTable/ReadOnlyTable.styled'
import { Title } from './SearchTermsTable.styled'
import { useTranslation } from 'next-i18next'

interface ISearchTermsTableProps {
  title?: string
  data: {
    term: string
    session: number
  }[]
}

function SearchTermsTable({
  title,
  data,
}: ISearchTermsTableProps): JSX.Element {
  const { t } = useTranslation('searchUsage')

  const header = {
    cells: [
      {
        id: 'terms',
        value: t('Terms'),
        style: {
          width: '50%',
        },
      },
      {
        id: 'sessions',
        value: t('Sessions'),
        style: {
          width: '50%',
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
    <div style={{ width: '100%' }}>
      {Boolean(title) && <Title>{title}</Title>}
      <ReadOnlyTable header={header} body={body} fullWidth />
    </div>
  )
}

export default SearchTermsTable
