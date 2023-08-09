import { TFunction } from 'next-i18next'
import {
  IRequestType,
  IRequestTypesOptions,
  ISearchLimitations,
} from '../types'

export function getFormValidityError(validity: ValidityState): string {
  for (const key in validity) {
    if (validity[key as keyof ValidityState]) {
      return key
    }
  }
}

export function getRequestTypeErrorMessages(
  data: IRequestType,
  api: IRequestTypesOptions[],
  t: TFunction
): string[] {
  if (!data || !api) {
    return []
  }

  const msgErrors: string[] = []

  data.requestTypes
    .filter((item) => !item.applyToAll)
    .forEach((item) => {
      const requestTypeOptions = api.find(
        (it) => it.value === item.requestType
      )?.limitationType

      const limitationsData =
        data[`${requestTypeOptions}Limitations` as keyof IRequestType]

      const searchLimitationsQueryTextEmpty = (
        limitationsData as ISearchLimitations[]
      )?.find((it) => it?.queryText === null)

      switch (requestTypeOptions) {
        case 'category':
          if (limitationsData?.length === 0) {
            msgErrors.push(t('empty.categoryLimitations'))
          }
          return

        case 'search':
          if (limitationsData?.length === 0) {
            msgErrors.push(t('empty.searchLimitations'))
          } else if (searchLimitationsQueryTextEmpty) {
            msgErrors.push(t('empty.searchLimitations.queryText'))
          }
      }
    })

  return msgErrors
}

export function isRequestTypeValid(
  data: IRequestType,
  api: IRequestTypesOptions[],
  t: TFunction
): boolean {
  return getRequestTypeErrorMessages(data, api, t)?.length === 0
}
