import React from 'react'
import InfoTooltip from '../form/InfoTooltip'

interface IProps {
  values: string[]
  max?: number
}

function FormatArray(props: IProps): JSX.Element {
  const { values, max } = props
  const valuesSliced = values.slice(0, max)
  const tooltipContent = values.map((item) => <div key={item}>{item}</div>)

  return (
    <div>
      {valuesSliced.map((value, index, valuesSliced) => {
        if (values.length > max && valuesSliced.length === index + 1) {
          return (
            <InfoTooltip title={tooltipContent} noStyle key={value}>
              {value}...
            </InfoTooltip>
          )
        }
        return <div key={value}>{value}</div>
      })}
    </div>
  )
}

export default FormatArray
