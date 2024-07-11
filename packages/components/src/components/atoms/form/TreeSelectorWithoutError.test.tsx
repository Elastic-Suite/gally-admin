import React from 'react'

import { renderWithProviders } from '../../../utils/tests'
import categories from '../../../../public/mocks/categories.json'

import TextFieldTagsWithoutError from './TreeSelectorWithoutError'

describe('TreeSelector', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(
      <TextFieldTagsWithoutError
        data={categories.categories}
        multiple
        value={[]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
