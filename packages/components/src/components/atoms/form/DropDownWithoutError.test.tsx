import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import DropDownWithoutError from './DropDownWithoutError'

describe('DropDown match snapshot', () => {
  it('BadgeDisabledFalse', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        disabled={false}
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40, disabled: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeDisabledTrue', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        disabled
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeLabel', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        label="Label"
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeRequiredFalse', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        required={false}
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeRequiredTrue', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        required
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeMultiple', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        value={[]}
        multiple
        disabled={false}
        label="Label"
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Forty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeArrayObjectValue', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        value={[
          { '@id': 1, locale: 'fr_FR' },
          { '@id': 2, locale: 'en_US' },
        ]}
        multiple
        disabled={false}
        label="Label"
        objectKeyValue="locale"
        options={[
          { value: 'en_US', label: 'English (United States)' },
          { value: 'fr_FR', label: 'French (France)' },
          { value: 'en_CA', label: 'English (Canada)' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
  it('BadgeObjectValue', () => {
    const { container } = renderWithProviders(
      <DropDownWithoutError
        value={{ '@id': 1, locale: 'fr_FR' }}
        disabled={false}
        label="Label"
        objectKeyValue="locale"
        options={[
          { value: 'en_US', label: 'English (United States)' },
          { value: 'fr_FR', label: 'French (France)' },
          { value: 'en_CA', label: 'English (Canada)' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
