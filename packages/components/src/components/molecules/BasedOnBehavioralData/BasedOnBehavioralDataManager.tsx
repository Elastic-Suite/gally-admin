import React from 'react'
import { useResourceOptions } from '../../../hooks'
import { boostModels } from '../../../services/boostModel'
import BasedOnBehavioralData, {
  IBasedOnBehavioralDataProps,
  IBasedOnBehavioralDataTypeOptions,
} from './BasedOnBehavioralData'

function BasedOnBehavioralDataManager(
  props: Omit<IBasedOnBehavioralDataProps, 'boostImpactOptions' | 'data_type'>
): JSX.Element {
  const boostImpactOptions = useResourceOptions('BoostImpactOption', {
    model: boostModels.behavioralData,
  })
  const metric = useResourceOptions('BehavioralDataTypeOption', {
    field: 'metric',
  })
  const timeframe = useResourceOptions('BehavioralDataTypeOption', {
    field: 'timeframe',
  })
  const calculation = useResourceOptions('BehavioralDataTypeOption', {
    field: 'calculation',
  })

  if (!boostImpactOptions || !metric || !timeframe || !calculation) {
    return null
  }

  const dataTypeOptions: IBasedOnBehavioralDataTypeOptions = {
    metric,
    timeframe,
    calculation,
  }

  return (
    <BasedOnBehavioralData
      boostImpactOptions={boostImpactOptions}
      data_type={dataTypeOptions}
      {...props}
    />
  )
}

export default BasedOnBehavioralDataManager
