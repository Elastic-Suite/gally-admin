import { LoadStatus } from '@elastic-suite/gally-admin-shared'

import { IKPI } from '../components/molecules/KpiLoader/KpiLoader'

import { hasNoData, isFirstLoad } from './kpi'

const kpi: IKPI = { id: 'kpi' }

describe('Kpi service', () => {
  describe('isFirstLoad', () => {
    it('is true while nothing has loaded yet', () => {
      expect(isFirstLoad({ kpis: [], status: LoadStatus.IDLE })).toBe(true)
      expect(isFirstLoad({ kpis: [], status: LoadStatus.LOADING })).toBe(true)
    })

    it('is false once data is there or loading is over', () => {
      expect(isFirstLoad({ kpis: [kpi], status: LoadStatus.LOADING })).toBe(
        false
      )
      expect(isFirstLoad({ kpis: [], status: LoadStatus.SUCCEEDED })).toBe(
        false
      )
      expect(isFirstLoad({ kpis: [], status: LoadStatus.FAILED })).toBe(false)
    })
  })

  describe('hasNoData', () => {
    it('is true only for a successful empty load', () => {
      expect(hasNoData({ kpis: [], status: LoadStatus.SUCCEEDED })).toBe(true)
      expect(hasNoData({ kpis: [kpi], status: LoadStatus.SUCCEEDED })).toBe(
        false
      )
      expect(hasNoData({ kpis: [], status: LoadStatus.LOADING })).toBe(false)
      expect(hasNoData({ kpis: [], status: LoadStatus.FAILED })).toBe(false)
    })
  })
})
