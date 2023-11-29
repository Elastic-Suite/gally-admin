import { IExplainVariables, LimitationType } from '../types/'

export function isGraphQLValidVariables(
  variables: IExplainVariables,
  limitationType: string
): boolean {
  let isValid =
    Boolean(variables?.localizedCatalog) && Boolean(variables?.requestType)
  if (limitationType === LimitationType.CATEGORY) {
    isValid = isValid && Boolean(variables?.category)
  } else if (limitationType === LimitationType.SEARCH) {
    isValid = isValid && Boolean(variables?.search?.trim())
  }

  return isValid
}

export function cleanExplainGraphQLVariables(
  variables: IExplainVariables,
  limitationType: string
): IExplainVariables {
  const cleanedVariables = { ...variables }
  if (limitationType === LimitationType.CATEGORY) {
    delete cleanedVariables.search
  } else if (limitationType === LimitationType.SEARCH) {
    delete cleanedVariables.category
  }

  return cleanedVariables
}
