import React from 'react'
import { CircularProgress } from '@mui/material'
import { LoadStatus } from '@elastic-suite/gally-admin-shared'

import { TestId, generateTestId, joinItemIds } from '../../../utils/testIds'
import Button from '../../atoms/buttons/Button'
import PopIn from '../../atoms/modals/PopIn'
import KpiLoader, {
  IKpiTermItem,
  IKpiTermList,
  readTermList,
} from '../KpiLoader/KpiLoader'

import { StyledPopinLoader } from './KpiSearchUsage.styled'
import TermsGrid from './TermsGrid'

const allTermsParameters = { pageSize: 1000 }

const allTermsPopinStyles = {
  paper: { width: 760, maxWidth: '90vw', height: '80vh' },
}

interface IAllTermsPopInProps<T extends IKpiTermItem> {
  componentId: string
  endpoint: string
  title: string
  buttonLabel: string
  columns: (keyof T & string)[]
}

function AllTermsPopIn<T extends IKpiTermItem>({
  componentId,
  endpoint,
  title,
  buttonLabel,
  columns,
}: IAllTermsPopInProps<T>): JSX.Element {
  const allTermsId = joinItemIds(componentId, 'all')

  return (
    <PopIn
      componentId={allTermsId}
      position="center"
      titlePopIn={title}
      styles={allTermsPopinStyles}
      triggerElement={
        <Button
          display="secondary"
          data-testid={generateTestId(TestId.KPI_SEE_ALL_BUTTON, componentId)}
        >
          {buttonLabel}
        </Button>
      }
    >
      <KpiLoader<IKpiTermList<T>>
        endpoint={endpoint}
        searchParameters={allTermsParameters}
      >
        {({ kpis, status }): JSX.Element =>
          status === LoadStatus.LOADING && kpis.length === 0 ? (
            <StyledPopinLoader
              data-testid={generateTestId(
                TestId.KPI_ALL_TERMS_LOADER,
                componentId
              )}
            >
              <CircularProgress color="inherit" size="25px" />
            </StyledPopinLoader>
          ) : (
            <TermsGrid
              componentId={allTermsId}
              rows={readTermList(kpis).terms}
              columns={columns}
            />
          )
        }
      </KpiLoader>
    </PopIn>
  )
}

export default AllTermsPopIn
