import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import ProportionalToAttributes from './ProportionalToAttributes'
import boostImpactOptionsMock from '../../../../public/mocks/boost_impact_options.json'

describe('ProportionalToAttributes', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(
      <ProportionalToAttributes
        value={{
          source_field_code: undefined,
          boost_impact: undefined,
          scale_factor: 1,
        }}
        sourceFields={[
          {
            id: 'links_exist',
            value: 'links_exist',
            label: 'Product links exist',
          },
          {
            id: 'links_exist2',
            value: 'links_exist2',
            label: 'Product links exist2',
          },
        ]}
        boostImpactOptions={boostImpactOptionsMock['hydra:member']}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
