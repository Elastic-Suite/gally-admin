import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ProportionalToAttributesComponent, {
  IProportionalToAttributesValue,
} from './ProportionalToAttributes'

export default {
  title: 'Molecules/ProportionalToAttributesComponent',
  component: ProportionalToAttributesComponent,
} as ComponentMeta<typeof ProportionalToAttributesComponent>

const Template: ComponentStory<typeof ProportionalToAttributesComponent> = (
  args
) => {
  const [value, setValue] = useState<IProportionalToAttributesValue>({
    sourceField: undefined,
    boostImpact: undefined,
    scaleFactor: 0,
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
  boostImpactOptions: [
    {
      label: 'Low',
      value: 'Low',
    },
    {
      label: 'Medium',
      value: 'Medium',
    },
    {
      label: 'High',
      value: 'High',
    },
  ],
  sourceFields: [
    {
      label: 'test',
      value: 'test',
    },
  ],
}
