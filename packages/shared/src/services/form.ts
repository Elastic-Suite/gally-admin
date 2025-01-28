import { TFunction } from 'next-i18next'
import {
  IExpansions,
  IRequestType,
  IRequestTypesOptions,
  ISearchLimitations,
  ISynonyms,
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

export function getSynonymsErrorMessages(synonyms: ISynonyms): string[] {
  const errors: string[] = []
  synonyms.forEach((synonym) => {
    if (synonym.terms.length === 0) {
      errors.push('synonym.error_message.terms.size.invalid')
    } else {
      if (synonym.terms.length < 2) {
        errors.push('synonym.error_message.terms.size.invalid')
      } else {
        synonym.terms.forEach((term) => {
          if (term.term === undefined || term.term === '') {
            errors.push('synonym.error_message.terms.size.invalid')
          }
        })
      }
      const terms = synonym.terms.map((term) => term.term)
      if (terms.length !== [...new Set(terms)].length) {
        errors.push('synonym.error_message.terms.duplicate')
      }
    }
  })

  // Remove duplicates.
  return [...new Set(errors)]
}

export function areSynonymsValid(synonyms: ISynonyms): boolean {
  return getSynonymsErrorMessages(synonyms).length === 0
}

export function getExpansionsErrorMessages(expansions: IExpansions): string[] {
  const errors: string[] = []
  const referenceTerms: string[] = []
  expansions.forEach((expansion) => {
    if (
      expansion.referenceTerm === undefined ||
      expansion.referenceTerm === ''
    ) {
      errors.push('expansion.error_message.reference_term.empty')
    } else {
      referenceTerms.push(expansion.referenceTerm)
    }

    if (expansion.terms.length === 0) {
      errors.push('expansion.error_message.expansion_terms.empty')
    } else {
      expansion.terms.forEach((term) => {
        if (term.term === undefined || term.term === '') {
          errors.push('expansion.error_message.expansion_terms.empty')
        }
      })

      const terms = expansion.terms.map((term) => term.term)
      if (terms.length !== [...new Set(terms)].length) {
        errors.push('expansion.error_message.expansion_terms.duplicate')
      }
    }
  })

  if (referenceTerms.length !== [...new Set(referenceTerms)].length) {
    errors.push('expansion.error_message.reference_terms.duplicate')
  }

  // Remove duplicates.
  return [...new Set(errors)]
}

export function areExpansionsValid(expansions: IExpansions): boolean {
  return getExpansionsErrorMessages(expansions).length === 0
}
