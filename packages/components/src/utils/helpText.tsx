import React, { ReactNode } from 'react'

const lineBreak = /<br\s*\/?>/i

// Each <br /> becomes a line break; anything else is shown as text, never as
// HTML. Returns undefined for no text, which hides the help icon.
export function formatHelpText(help?: string | null): ReactNode {
  if (!help) {
    return undefined
  }
  const [first, ...rest] = help.split(lineBreak)
  return rest.reduce<ReactNode>(
    (content, part) => (
      <>
        {content}
        <br />
        {part}
      </>
    ),
    first
  )
}
