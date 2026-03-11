import { Bundle } from '../types'

import { isSearchUsageEnabled, isVirtualCategoryEnabled } from './bundle'

describe('bundle service', () => {
  describe('isVirtualCategoryEnabled', () => {
    it('should test if VirtualCategory bundle is enabled', () => {
      expect(isVirtualCategoryEnabled([])).toEqual(false)
      expect(isVirtualCategoryEnabled([Bundle.VIRTUAL_CATEGORY])).toEqual(true)
    })
  })

  describe('isSearchUsageEnabled', () => {
    it('should test if SearchUsage bundle is enabled', () => {
      expect(isSearchUsageEnabled([])).toEqual(false)
      expect(isSearchUsageEnabled([Bundle.SEARCH_USAGE])).toEqual(true)
    })
  })
})
