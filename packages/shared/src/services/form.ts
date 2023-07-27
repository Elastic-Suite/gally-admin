import { IRequestType, IRequestTypes, ISearchLimitations } from '../types'

export function getFormValidityError(validity: ValidityState): string {
  for (const key in validity) {
    if (validity[key as keyof ValidityState]) {
      return key
    }
  }
}

export function isRequestTypeValid(
  data?: Record<string, unknown> | IRequestType
): boolean {
  const searchLimitationsIsNullOrEmpty =
    (data?.searchLimitations as unknown as ISearchLimitations[])?.length === 0

  const searchLimitationsIsApplyToAll = (
    data?.requestTypes as IRequestTypes[]
  )?.find(
    (itemRt) => itemRt?.requestType === 'product_search' && itemRt?.applyToAll
  )

  if (searchLimitationsIsNullOrEmpty || searchLimitationsIsApplyToAll) {
    return true
  }

  return !(data?.searchLimitations as ISearchLimitations[])?.some(
    (searchLimitation) =>
      !searchLimitation?.queryText && searchLimitation?.operator
  )
}
