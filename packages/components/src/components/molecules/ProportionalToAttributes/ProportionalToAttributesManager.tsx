import React from 'react'
import { useResourceOptions } from '../../../hooks'
import { boostModels } from '../../../services/boostModel'
import ProportionalToAttributes, {
  IProportionalToAttributesProps,
} from './ProportionalToAttributes'

function ProportionalToAttributesManager(
  props: Omit<
    IProportionalToAttributesProps,
    'sourceFields' | 'boostImpactOptions'
  >
): JSX.Element {
  const boostImpactOptions = useResourceOptions('BoostImpactOption', {
    model: boostModels.attributeValue,
  })
  const sourceFields = useResourceOptions('BoostAttributeValueFieldOption', {
    'metadata.entity': 'product',
  })

  if (!boostImpactOptions || !sourceFields) {
    return null
  }

  return (
    <ProportionalToAttributes
      sourceFields={sourceFields}
      boostImpactOptions={boostImpactOptions}
      {...props}
    />
  )
}

export default ProportionalToAttributesManager
