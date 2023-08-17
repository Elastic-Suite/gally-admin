import React from 'react'
import { IMultipleValueFormat } from '@elastic-suite/gally-admin-shared'
import FormatArray from '../../atoms/format/FormatArray'
import FormatText from '../../atoms/format/FormatText'

interface IProps {
  values: string[]
  multipleValueFormat?: IMultipleValueFormat
}

function FormatRowArray(props: IProps): JSX.Element {
  const { values, multipleValueFormat } = props
  const content: string | string[] = multipleValueFormat?.separator
    ? values.join(multipleValueFormat.separator)
    : values

  if (!multipleValueFormat?.maxCount) {
    return (
      <div>
        {content instanceof Array
          ? content.map((item) => <div key={item}>{item}</div>)
          : content}
      </div>
    )
  }

  let maxChar = values.reduce(
    (acc, item, index) =>
      index < multipleValueFormat.maxCount ? acc + item.length : acc,
    0
  )
  maxChar =
    maxChar +
    (multipleValueFormat.maxCount - 1) * multipleValueFormat?.separator?.length

  return (
    <div>
      {content instanceof Array ? (
        <FormatArray values={content} max={multipleValueFormat.maxCount} />
      ) : (
        <FormatText
          name={content}
          max={maxChar}
          toolTip
          firstLetterUpp={false}
        />
      )}
    </div>
  )
}

export default FormatRowArray
