import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import DropDown from './DropDown'

describe('DropDown match snapshot', () => {
  it('BadgeDisabledFalse', () => {
    const { container } = renderWithProviders(
      <DropDown
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
      <DropDown
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
      <DropDown
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
      <DropDown
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
      <DropDown
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
      <DropDown
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
      <DropDown
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
      <DropDown
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
