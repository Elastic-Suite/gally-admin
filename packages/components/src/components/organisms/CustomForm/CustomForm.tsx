import React, { useState } from 'react'
// import boostData from '../../../../public/mocks/boostData.json'
import boostJsLd from '../../../../public/mocks/boostJsLd.json'
import {
  useApiDoubleDatePicker,
  useApiHeadersForm,
  useResource,
} from '../../../hooks'
import { IResource } from '@elastic-suite/gally-admin-shared'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import DoubleDatePicker from '../../atoms/form/DoubleDatePicker'

function transformDateForApiBoost(data) {
  return {}
}

function CustomForm(): JSX.Element {
  const [data, setData]: any = useState()
  const resource = boostJsLd as IResource

  // console.log('resource', resource)

  function handleChange(a, e) {
    // console.log('handleChange', a, e)

    return setData({ ...data, [a]: e })
  }

  const a = useApiHeadersForm(resource)
  console.log('useApiHeadersForm', useApiHeadersForm)

  const b = useApiDoubleDatePicker(a)

  console.log('useApiDoubleDatePicker', b)

  return (
    <div>
      {a.map((item) => {
        if (item?.children) {
          return (
            <>
              <h1>{item.label}</h1>
              <div>
                {item.children.map((it) => {
                  const val = data?.[it.name]
                  return (
                    <div>
                      <FieldGuesser
                        {...it}
                        // label=""
                        onChange={handleChange}
                        // row={tableRow}
                        value={val}
                        editable
                        // {...getFieldState(
                        //   tableRow,
                        //   stickyHeader.depends,
                        //   tableConfig[stickyHeader.name]
                        // )}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          )
        }
        return <div>{item.label}</div>
      })}
    </div>
  )
}

export default CustomForm
