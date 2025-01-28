import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ProportionalToAttributesComponent, {
  IProportionalToAttributesValue,
} from './ProportionalToAttributes'
import boostImpactOptionsMock from '../../../../public/mocks/boost_impact_options.json'

export default {
  title: 'Molecules/ProportionalToAttributesComponent',
  component: ProportionalToAttributesComponent,
} as ComponentMeta<typeof ProportionalToAttributesComponent>

const Template: ComponentStory<typeof ProportionalToAttributesComponent> = (
  args
) => {
  const [value, setValue] = useState<IProportionalToAttributesValue>({
    source_field_code: undefined,
    boost_impact: undefined,
    scale_factor: 1,
  })
  return (
    <ProportionalToAttributesComponent
      {...args}
      value={value}
      onChange={(value): void => setValue(value)}
    />
  )
}

export const ProportionalToAttributes = Template.bind({})

ProportionalToAttributes.args = {
  boostImpactOptions: boostImpactOptionsMock['hydra:member'],
  sourceFields: [
    {
      label: 'test',
      value: 'test',
    },
  ],
}
