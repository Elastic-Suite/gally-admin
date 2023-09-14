import React, {
  ForwardedRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Component } from 'ionicons/dist/types/stencil-public-runtime'
import Button from '../buttons/Button'
import InputTextError from './InputTextError'
import DoubleDatePickerError from './DoubleDatePickerError'
import { IDoubleDatePickerValues } from './DoubleDatePicker'
import TextFieldTagsError from './TextFieldTagsError'
import DatePicker from './DatePicker'
import DatePickerError from './DatePickerError'
import RangeError from './RangeError'
import DropdownError from './DropDownError'
import Form, { FormContext } from './Form'
import TreeSelectorError from './TreeSelectorError'
import categories from '../../../../public/mocks/categories.json'
import RequestType from './RequestType'
import dataGeneralBoost from '../../../../public/mocks/requestTypes.json'
import limitationsTypes from '../../../../public/mocks/boost_limitation_type_options.json'
import requestTypesOptions from '../../../../public/mocks/boost_request_type_options.json'
import textOperatorOptions from '../../../../public/mocks/boost_query_text_operator_options.json'

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

const Template = (args) => {
  // const {formRef, formIsValid} = useControlFormError()
  const [showAllErrors, setShowAllErrors] = useState(false)
  console.log('SHOW ALL ERRORS =>', showAllErrors)

  const [data, setData] = useState({
    inputTextRequired: '',
    inputTextNotRequired: '',
    doubleDatePicker: {
      from: '',
      to: '',
    },
    textFieldTags: [],
    datePicker: null,
    range: [0, 0],
    dropdown: null,
    multipleDropdown: [],
    treeSelectorMultiple: [],
    treeSelector: [],
    requestType: dataGeneralBoost,
  })

  const handleClickButton = (formIsValid): void => {
    if (formIsValid) {
      alert('VALID')
    } else {
      setShowAllErrors(true)
    }
  }

  return (
    <Form
      onSubmit={handleClickButton}
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
        value={data.inputTextNotRequired}
        onChange={(value: string) => {
          setData({ ...data, inputTextNotRequired: value })
        }}
      />

      {/* <RequestType
      value={data.requestType}
      required
      onChange={(value) => {
        setData({...data, requestType: value})
      }}
      options={textOperatorOptions['hydra:member']}
      limitationsTypes={limitationsTypes['hydra:member']}
      requestTypesOptions={requestTypesOptions['hydra:member']}
      categoriesList={categories.categories}
      /> */}

      {/* <TreeSelectorError
      required
      showError={showAllErrors}
      value={data.treeSelectorMultiple}
      multiple
      data={categories.categories}
      onChange={(value) => {
        setData({...data, treeSelectorMultiple: value})
      }}
      label="Tree selector required"
      onError={(value) => {
        alert(`ERROR => ${value}`)
      }}
    /> */}

      {/* <TreeSelectorError
      required
      showError
      value={data.treeSelector}
      data={categories.categories}
      onChange={(value) => {
        setData({...data, treeSelector: value})
      }}
      label="Tree selector required"
    /> */}
      {/* <form ref={formRef}  onSubmit={(e) => {
      e.preventDefault()
    }} style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      justifyContent: "start",
      alignItems: "start"
    }}> */}
      {/* <InputTextError
        showError
        label="Champs requis"
        required
        value={data.inputTextRequired}
        onChange={(value: string) => {
          setData({...data, inputTextRequired: value})
        }}
      />
*/}

      {/* <DoubleDatePickerError
      showError
      required
      label="Double date picker requis"
      value={data.doubleDatePicker}
      onChange={(value: IDoubleDatePickerValues) => {
        setData({...data, doubleDatePicker: value})
      }}
      /> */}

      <DatePickerError
      placeholder='Votre date'
        showError={showAllErrors}
        label="Date picker"
        value={data.datePicker}
        required
        onChange={(value) => {
          setData({ ...data, datePicker: value })
        }}
      />

      <TextFieldTagsError
        showError={showAllErrors}
        withCleanButton
        required
        label="Text Field Tag Error"
        value={data.textFieldTags}
        onChange={(value) => {
          setData({ ...data, textFieldTags: value })
        }}
      />

      {/*
      <RangeError
        value={data.range}
        required
        showError
        label="Range required"
        onChange={(value) => {
          setData({...data, range: value})
        }}
      /> */}

      {/* <DropdownError
        required
        showError
        label="Dropdown"
        options={[
          {
            label: 'First value',
            value: 'First value'
          }
        ]}
        value={data.dropdown}
        onChange={(value) => {
          setData({...data, dropdown: value})
        }}
      />

      <DropdownError
        required
        multiple
        showError
        label="Multiple dropdown"
        options={[
          {
            label: 'First value',
            value: 'First value'
          },
          {
            label: 'Second value',
            value: 'Second value'
          }
        ]}
        value={data.multipleDropdown}
        onChange={(value) => {
          setData({...data, multipleDropdown: value})
        }}
      /> */}

      {/* <p>Le formulaire {formIsValid ? "est VALIDE" : "n'est PAS VALIDE"}</p> */}
    </Form>
  )
}

export const Default = Template.bind({})
