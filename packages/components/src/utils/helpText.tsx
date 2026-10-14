import React, { ReactNode } from 'react'

// The only tag a help text from the API may hold.
const lineBreak = /<br\s*\/?>/i

/**
 * Turns a help text from the API into tooltip content. Each <br /> becomes a
 * line break; anything else, tags included, is shown as text, never as HTML.
 * Returns undefined when there is no text, so no help icon is shown.
 */
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
