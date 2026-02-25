import { useHomePageUrl } from './useHomePageUrl'
import {
  isDashboardEnabled,
  premiumHomePageUrl,
  standardHomePageUrl,
} from '@elastic-suite/gally-admin-shared'
import { renderHookWithProviders } from '../utils/tests'

describe('useHomePageUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return standard homepage url if the user has only standard packages', () => {
    ;(isDashboardEnabled as jest.Mock).mockReturnValue(false)
    renderHookWithProviders(() => {
      const afterLoginRedirectUrl = useHomePageUrl()
      expect(afterLoginRedirectUrl).toEqual(standardHomePageUrl)
    })
  })

  it('should return premium homepage url if the user has premium dashboard package', () => {
    ;(isDashboardEnabled as jest.Mock).mockReturnValue(true)
    renderHookWithProviders(() => {
      const afterLoginRedirectUrl = useHomePageUrl()
      expect(afterLoginRedirectUrl).toEqual(premiumHomePageUrl)
    })
  })
})
