import { RuleCombinationOperator } from '../types'

import { getOptionsFromEnum } from './options'

describe('Options service', () => {
  describe('getOptionsFromEnum', () => {
    it('should get the options from enum', () => {
      expect(
        getOptionsFromEnum(RuleCombinationOperator, <T>(x: T): T => x)
      ).toEqual([
        { value: 'all', label: 'ALL' },
        { value: 'any', label: 'ANY' },
      ])
    })
  })
})
