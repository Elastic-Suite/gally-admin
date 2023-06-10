import React, { useContext, useEffect } from 'react'
import {
  IFieldGuesserProps,
  IOption,
  IOptions,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../contexts'
import Slider from '../../atoms/form/Slider'
import Switch from '../../atoms/form/Switch'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (val: string) => void
}

function initOrUpdateModelConfigValue(
  otp: IOption<unknown>,
  data?: unknown
): string {
  switch (otp?.input) {
    case 'slider':
      return JSON.stringify({
        [otp?.value as string]: data !== undefined ? String(data) : '0',
      })

    case 'behavioral': //TODO TO DELETE
      return JSON.stringify({
        [otp?.value as string]: data !== undefined ? String(data) : 'false',
      })

    default:
      break
  }
}

function EditableModelConfig(props: IProps): JSX.Element {
  const { field, value, onChange, data, options } = props
  const { fieldOptions, load, statuses } = useContext(optionsContext)

  function handleChange(otp: IOption<string>, data?: unknown): void {
    return onChange(initOrUpdateModelConfigValue(otp, data))
  }

  const optionsConfig = (options ??
    fieldOptions.get(field.property['@id']) ??
    []) as IOptions<string>

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  if (
    !optionsConfig ||
    statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED ||
    !data?.[optionsConfig?.[0]?.field]
  ) {
    return null
  }

  return (
    <>
      {optionsConfig.map((otp) => {
        if (data[otp?.field] === otp?.value) {
          const val = value ? JSON.parse(value as string)?.[otp?.value] : null

          if (!val) {
            return handleChange(otp)
          }
          switch (otp?.input) {
            case 'slider':
              return (
                <Slider
                  key={otp?.input}
                  value={Number(val)}
                  onChange={(e): void => handleChange(otp, e)}
                />
              )

            case 'behavioral': // TODO TO DELETE
              return (
                <Switch
                  key={otp?.input}
                  checked={JSON.parse(val)}
                  onChange={(e): void => handleChange(otp, e)}
                />
              )

            default:
              return null
          }
        }
        return null
      })}
    </>
  )
}

export default EditableModelConfig
