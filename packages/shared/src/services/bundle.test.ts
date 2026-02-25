import { Bundle } from '../types'

import { isDashboardEnabled, isVirtualCategoryEnabled } from './bundle'

describe('bundle service', () => {
  describe('isVirtualCategoryEnabled', () => {
    it('should test if VirtualCategory bundle is enabled', () => {
      expect(isVirtualCategoryEnabled([])).toEqual(false)
      expect(isVirtualCategoryEnabled([Bundle.VIRTUAL_CATEGORY])).toEqual(true)
    })
  })

  describe('isDashboardEnabled', () => {
    it('should test if Dashboard bundle is enabled', () => {
      expect(isDashboardEnabled([])).toEqual(false)
      expect(isDashboardEnabled([Bundle.DASHBOARD])).toEqual(true)
    })
  })
})
