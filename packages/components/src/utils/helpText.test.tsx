import React from 'react'
import { render } from '@testing-library/react'

import { formatHelpText } from './helpText'

function renderHelp(help?: string): string {
  return render(<div>{formatHelpText(help)}</div>).container.innerHTML
}

describe('formatHelpText', () => {
  it('returns nothing without a text', () => {
    expect(formatHelpText(undefined)).toBeUndefined()
    expect(formatHelpText('')).toBeUndefined()
  })

  it('turns each line break tag into a line break', () => {
    expect(renderHelp('One.<br /><br />Two.<br>Three.<BR/>Four.')).toBe(
      '<div>One.<br><br>Two.<br>Three.<br>Four.</div>'
    )
  })

  it('shows any other tag as text', () => {
    expect(renderHelp('<b>Bold</b> <img src=x onerror=alert(1)>')).toBe(
      '<div>&lt;b&gt;Bold&lt;/b&gt; &lt;img src=x onerror=alert(1)&gt;</div>'
    )
  })
})
