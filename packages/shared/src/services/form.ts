import {
  IExpansions,
  IField,
  IRequestType,
  IRequestTypes,
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
  let referenceTerms: string[] = []
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

export function isDependsField(
  field: IField,
  data: Record<string, unknown>
): boolean {
  return (
    !field?.gally?.depends ||
    (field.gally.depends?.field in data &&
      data[field.gally.depends.field] === field.gally.depends?.value)
  )
}
