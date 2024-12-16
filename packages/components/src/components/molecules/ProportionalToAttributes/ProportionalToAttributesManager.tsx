import React, { useMemo } from 'react'
import { useApiList, useResource } from '../../../hooks'
import ProportionalToAttributes, {
  IProportionalToAttributesProps,
} from './ProportionalToAttributes'
import { IOption } from '@elastic-suite/gally-admin-shared'

function ProportionalToAttributesManager(
  props: Omit<
    IProportionalToAttributesProps,
    'sourceFields' | 'boostImpactOptions'
  >
): JSX.Element {
  const rowsPerPage = 200
  const sourceFieldFixedFilters = useMemo(
    () => ({
      'metadata.entity': 'product',
    }),
    []
  )

  const boostImpactOptionResource = useResource('BoostImpactOption')
  const boostAttributeValueFieldOptionsResource = useResource(
    'BoostAttributeValueFieldOption'
  )

  const [boostImpactOptionsResponse] = useApiList<IOption<string>>(
    boostImpactOptionResource,
    false,
    rowsPerPage,
    undefined,
    undefined,
    false,
    true
  )

  const [boostAttributeValueFieldOptionsResponse] = useApiList<IOption<string>>(
    boostAttributeValueFieldOptionsResource,
    false,
    rowsPerPage,
    sourceFieldFixedFilters,
    undefined,
    false,
    true
  )

  if (
    !boostImpactOptionsResponse?.data ||
    !boostAttributeValueFieldOptionsResponse?.data
  ) {
    return null
  }

  return (
    <ProportionalToAttributes
      sourceFields={
        boostAttributeValueFieldOptionsResponse.data['hydra:member']
      }
      boostImpactOptions={boostImpactOptionsResponse.data['hydra:member']}
      {...props}
    />
  )
}

export default ProportionalToAttributesManager
