import React, { ReactNode } from 'react'
import { TooltipProps } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { LoadStatus } from '@elastic-suite/gally-admin-shared'

import { formatHelpText } from '../../../utils/helpText'
import { TestId, generateTestId } from '../../../utils/testIds'
import InfoTooltip from '../../atoms/form/InfoTooltip'
import KpiLoader, {
  IKpiTermItem,
  IKpiTermList,
  readTermList,
} from '../KpiLoader/KpiLoader'

import AllTermsPopIn from './AllTermsPopIn'
import {
  StyledNoData,
  StyledTableActions,
  StyledTermsTableTitle,
} from './KpiSearchUsage.styled'
import { isFirstLoad } from './loadState'
import ReservedSpace from './ReservedSpace'
import TermsGrid from './TermsGrid'

const termsTableHeight = 69 + 10 * 49 // header on two lines, 10 rows
// Right-side tables: open below or above, not over the table title.
const termsTableTooltipFallbacks: TooltipProps['placement'][] = [
  'bottom',
  'top',
]

interface ITermsTableProps<T extends IKpiTermItem> {
  componentId: string
  endpoint: string
  title: string
  seeAllLabel: string
  columns: (keyof T & string)[]
  children?: ReactNode
}

function TermsTable<T extends IKpiTermItem>({
  componentId,
  endpoint,
  title,
  seeAllLabel,
  columns,
  children,
}: ITermsTableProps<T>): JSX.Element {
  const { t } = useTranslation('searchUsage')

  return (
    <div data-testid={generateTestId(TestId.KPI_TERMS_TABLE, componentId)}>
      <KpiLoader<IKpiTermList<T>> endpoint={endpoint}>
        {(result): JSX.Element => {
          const { help, terms } = readTermList(result.kpis)
          const isEmpty =
            result.status === LoadStatus.SUCCEEDED && terms.length === 0
          const helpContent = formatHelpText(help)
          return (
            <>
              <StyledTermsTableTitle>
                {title}{' '}
                {helpContent ? (
                  <InfoTooltip
                    componentId={componentId}
                    title={helpContent}
                    fallbackPlacements={termsTableTooltipFallbacks}
                  />
                ) : null}
              </StyledTermsTableTitle>
              <ReservedSpace
                isLoading={isFirstLoad(result)}
                minHeight={termsTableHeight}
              >
                {isEmpty ? (
                  <StyledNoData
                    data-testid={generateTestId(TestId.NO_DATA, componentId)}
                  >
                    {t('noData')}
                  </StyledNoData>
                ) : (
                  <TermsGrid
                    componentId={componentId}
                    rows={terms}
                    columns={columns}
                  />
                )}
              </ReservedSpace>
              <StyledTableActions>
                {!isEmpty && (
                  <AllTermsPopIn<T>
                    componentId={componentId}
                    endpoint={endpoint}
                    title={title}
                    buttonLabel={seeAllLabel}
                    columns={columns}
                  />
                )}
                {children}
              </StyledTableActions>
            </>
          )
        }}
      </KpiLoader>
    </div>
  )
}

export default TermsTable
