import React, { useState } from 'react'
import InputTextError from './InputTextError'
import DoubleDatePickerError from './DoubleDatePickerError'
import { IDoubleDatePickerValues } from './DoubleDatePicker'
import Form from './Form'
import categories from '../../../../public/mocks/categories.json'
import RequestType from './RequestType'
import dataGeneralBoost from '../../../../public/mocks/requestTypes.json'
import limitationsTypes from '../../../../public/mocks/boost_limitation_type_options.json'
import requestTypesOptions from '../../../../public/mocks/boost_request_type_options.json'
import textOperatorOptions from '../../../../public/mocks/boost_query_text_operator_options.json'
import {
  IRequestType,
  IRequestTypesOptions,
} from '@elastic-suite/gally-admin-shared'
import { action } from '@storybook/addon-actions'
export default {
  title: 'Atoms/Form/Form',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
}

const Template = (): JSX.Element => {
  const [showAllErrors, setShowAllErrors] = useState(false)

  const handleSubmit = (formIsValid: boolean): void => {
    if (formIsValid) {
      action('submit')()
    } else {
      setShowAllErrors(true)
    }
  }
  const [text, setText] = useState<string | number>('')
  const [doubleDate, setDoubleDate] = useState<IDoubleDatePickerValues>({
    from: null,
    to: null,
  })
  const [requestType, setRequestType] = useState<IRequestType>(dataGeneralBoost)

  return (
    <Form
      onSubmit={handleSubmit}
      submitButtonText="Créer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'start',
        alignItems: 'start',
      }}
    >
      <InputTextError
        showError={showAllErrors}
        required
        label="Champs non requis"
        value={text}
        onChange={setText}
      />

      <RequestType
        value={requestType}
        showError={showAllErrors}
        required
        onChange={setRequestType}
        options={textOperatorOptions['hydra:member']}
        limitationsTypes={limitationsTypes['hydra:member']}
        requestTypesOptions={
          requestTypesOptions['hydra:member'] as IRequestTypesOptions[]
        }
        categoriesList={categories.categories}
      />

      <DoubleDatePickerError
        showError={showAllErrors}
        required
        label="Double date picker requis"
        value={doubleDate}
        onChange={setDoubleDate}
      />
    </Form>
  )
}

export const Default = Template.bind({})
