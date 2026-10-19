import React, { useContext } from 'react'
import { useTranslation } from 'next-i18next'

import { kpiFiltersContext } from '../../../contexts'
import { TestId, generateTestId } from '../../../utils/testIds'
import Button from '../../atoms/buttons/Button'
import DoubleDatePicker from '../../atoms/form/DoubleDatePicker'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import CatalogSwitcher from '../../stateful/CatalogSwitcher/CatalogSwitcher'

import {
  StyledButtonContainer,
  StyledContainer,
  StyledForm,
  StyledPaper,
} from './KpiSearchUsage.styled'

function Filters(): JSX.Element {
  const { t } = useTranslation(['searchUsage', 'api'])
  const kpiFilters = useContext(kpiFiltersContext)

  return (
    <StyledPaper>
      <StyledForm
        ref={kpiFilters.formRef}
        onSubmit={kpiFilters.handleSubmit}
        data-testid={generateTestId(TestId.KPI_FILTERS)}
        noValidate
      >
        <CatalogSwitcher />
        <StyledContainer>
          <DoubleDatePicker
            componentId="period"
            label={t('period')}
            value={kpiFilters.dateFilter}
            onChange={kpiFilters.handleDateFilterChange}
            onError={kpiFilters.handleFiltersError}
            showError={kpiFilters.showError}
          />
        </StyledContainer>
        <StyledButtonContainer>
          <Button
            type="submit"
            disabled={kpiFilters.isRefreshDisabled}
            endIcon={<IonIcon name="checkmark-done-outline" />}
            data-testid={generateTestId(
              TestId.FILTER_APPLY_BUTTON,
              'searchUsage'
            )}
          >
            {t('filters.apply', { ns: 'api' })}
          </Button>
          <Button
            display="tertiary"
            disabled={kpiFilters.isRefreshDisabled}
            onClick={kpiFilters.handleReset}
            endIcon={<IonIcon name="reload-outline" />}
            data-testid={generateTestId(
              TestId.FILTER_CLEAR_BUTTON,
              'searchUsage'
            )}
          >
            {t('filters.clearAll', { ns: 'api' })}
          </Button>
        </StyledButtonContainer>
      </StyledForm>
    </StyledPaper>
  )
}

export default Filters
