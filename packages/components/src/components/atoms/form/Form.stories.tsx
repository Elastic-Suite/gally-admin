import React, { SyntheticEvent, useState } from 'react'
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
  IExpansions,
  IRequestType,
  IRequestTypesOptions,
  ISynonyms,
} from '@elastic-suite/gally-admin-shared'
import { action } from '@storybook/addon-actions'
import Synonym from './Synonym'
import ThesaurusSynonym from '../../../../public/mocks/thesaurus_synonym.json'
import Expansion from './Expansion'
import DropDownError from './DropDownError'
import Checkbox from './Checkbox'
import RadioGroupError from './RadioGroupError'

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

  const handleSubmit = (event: SyntheticEvent, formIsValid: boolean): void => {
    event.preventDefault()
    if (formIsValid) {
      action('submit')()
    } else {
      setShowAllErrors(true)
    }
  }
  const [text, setText] = useState<string | number>('')
  const [doubleDate, setDoubleDate] = useState<IDoubleDatePickerValues>({
    fromDate: null,
    toDate: null,
  })
  const [requestType, setRequestType] = useState<IRequestType>(dataGeneralBoost)
  const [synonym, setSynonym] = useState<ISynonyms>(ThesaurusSynonym.synonyms)
  const [expansion, setExpansion] = useState<IExpansions>([])
  const [dropdown, setDropdown] = useState<string | string[]>()
  const [checkbox, setCheckbox] = useState<boolean>(false)
  const [radioGroup, setRadioGroup] = useState<string>()

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
      <Checkbox
        checked={checkbox}
        onChange={setCheckbox}
        showError={showAllErrors}
        label="Label"
        required
      />
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

      <Synonym
        required
        showError={showAllErrors}
        value={synonym}
        label="Synoyms"
        onChange={setSynonym}
      />

      <Expansion
        required
        showError={showAllErrors}
        value={expansion}
        label="Expansion"
        onChange={setExpansion}
      />

      <DropDownError
        value={dropdown}
        onChange={setDropdown}
        showError={showAllErrors}
        required
        options={[
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Any',
            value: 'any',
          },
        ]}
      />

      <RadioGroupError
        value={radioGroup}
        onChange={setRadioGroup}
        required
        showError={showAllErrors}
        options={[
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Any',
            value: 'any',
          },
        ]}
      />
    </Form>
  )
}

export const Default = Template.bind({})
