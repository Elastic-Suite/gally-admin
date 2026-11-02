import { useEffect, useState } from 'react'
import {
  IRuleEngineOperators,
  isError,
  isVirtualCategoryEnabled,
} from '@elastic-suite/gally-admin-shared'

import { selectBundles, useAppSelector } from '../store'

import { useApiFetch } from './useApi'

/**
 * @param context adds the operators of this rule engine context (e.g. "recommender")
 */
export function useRuleOperators(
  ruleOperatorsDefault?: IRuleEngineOperators,
  context?: string
): IRuleEngineOperators {
  const [ruleOperators, setRuleOperators] = useState<IRuleEngineOperators>()
  const bundles = useAppSelector(selectBundles)
  const fetchApi = useApiFetch()

  useEffect(() => {
    if (
      (isVirtualCategoryEnabled(bundles) || context) &&
      !ruleOperatorsDefault
    ) {
      fetchApi<IRuleEngineOperators>(
        'rule_engine_operators',
        context ? { context } : undefined
      ).then((json) => {
        if (!isError(json)) {
          setRuleOperators(json)
        }
      })
    }
  }, [bundles, context, fetchApi, ruleOperatorsDefault])

  return ruleOperatorsDefault ?? ruleOperators
}
