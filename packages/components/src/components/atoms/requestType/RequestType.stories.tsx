import React, { useEffect, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import RequestTypeComponent from './RequestType'
import categories from '../../../../public/mocks/categories.json'
import {
  IRequestType,
  ITreeItem,
  RequestType,
} from '@elastic-suite/gally-admin-shared'

import {
  requestTypesOptions,
  textOperatorOptions,
  limitationsTypes,
  dataGeneralBoost as dataGenerals,
} from './RequestTypeMocks'

export default {
  title: 'Atoms/RequestType',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: RequestTypeComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof RequestTypeComponent>

const mocksListRequestType: IRequestType[] = [
  {
    label: 'Catalogue product view',
    id: 'catalogue_product_view',
    isSelected: true,
    labelIsAll: 'All categories',
    value: 10,
    type: RequestType.CATEGORIES,
    disabled: true,
  },
  {
    label: 'Search terms',
    id: 'search_terms',
    isSelected: true,
    labelIsAll: 'All search terms',
    value: 20,
    type: RequestType.TAGS,
    disabled: true,
  },
  {
    label: 'Autocomplete box',
    id: 'autocomplete_box',
    isSelected: false,
    labelIsAll: 'All autocomplete box',
    value: 30,
    type: RequestType.TAGS,
    disabled: true,
  },
  {
    label: 'Product bloc',
    id: 'product_bloc',
    isSelected: true,
    labelIsAll: 'All product block',
    value: 40,
    type: RequestType.PRODUCTS,
    disabled: true,
  },
]

const mocksDataTags = [
  {
    id: 'search_terms',
    data: ['TagsOne', 'TagsTwo'],
  },
  {
    id: 'catalogue_product_view',
    data: ['catalogue_product_view One', 'catalogue_product_view Two'],
  },
]

const Template: ComponentStory<typeof RequestTypeComponent> = (args) => {
  const [data, setData] = useState(mocksListRequestType)
  const [dataGeneral, setDataGeneral] = useState(dataGenerals)

  const [valCategories, setValCategories] = useState<ITreeItem[]>([])

  const [multiValue, setMultiValue] = useState<number[]>(
    mocksListRequestType
      .filter((item) => item.isSelected)
      .map((item) => item.value)
  )

  const [valTags, setValTags] =
    useState<{ id: string; data: string[] }[]>(mocksDataTags)

  function onChange(
    description: string,
    value?: string[] | string | number[] | number | ITreeItem[],
    idItem?: string,
    operator?: string
  ): void | null {
    switch (description) {
      case 'optionsDropdown':
        let newRequestTypeOptionsSelected
        if (typeof value === 'string') {
          newRequestTypeOptionsSelected = dataGeneral[0].requestTypes.filter(
            (it) => {
              return it.requestType !== value
            }
          )
        } else {
          newRequestTypeOptionsSelected = (value as string[]).map((item) => {
            return (
              dataGeneral[0].requestTypes.find(
                (it) => it.requestType === item
              ) ?? { applyToAll: false, requestType: item }
            )
          })
        }

        const newDataGeneral = dataGeneral.map((item) => {
          return { ...item, requestTypes: newRequestTypeOptionsSelected }
        })

        return setDataGeneral(newDataGeneral as any) // TODO

      case 'allSelected':
        const newRequestTypesSelected = dataGeneral[0].requestTypes.map(
          (item) => {
            if (item.requestType === idItem) {
              return { ...item, applyToAll: !item.applyToAll }
            }
            return item
          }
        )
        const newDataGeneralSelected = dataGeneral.map((item) => {
          return { ...item, requestTypes: newRequestTypesSelected }
        })
        return setDataGeneral(newDataGeneralSelected)

      case 'data':
        // console.log('value string', (value as string[]).pop())
        // console.log('value', value)
        // console.log('idItem', idItem)
        // console.log('operator', operator)
        // const newLimitations = [
        //   ...dataGeneral[0][idItem + 'Limitations'],
        //   { operator, queryText: (value as string[]).pop() },
        // ]
        // console.log('newLimitations', newLimitations)

        // const newDataGeneralLimitations = dataGeneral.map((item) => {
        //   return { ...item, [idItem + 'Limitations']: newLimitations }
        // })
        // console.log(newDataGeneralLimitations)
        // console.log('aaaaaaaaaaaaaaaaa')

        const newValue = (value as string[]).map((item) => ({
          operator,
          queryText: item,
        }))

        const newLimitationsDelete = dataGeneral[0][idItem + 'Limitations']
          .filter((it) => it.operator !== operator)
          .concat(newValue)

        const newDataGeneralLimitationsDelete = dataGeneral.map((item) => {
          return { ...item, [idItem + 'Limitations']: newLimitationsDelete }
        })
        return setDataGeneral(newDataGeneralLimitationsDelete)

      default:
        break
    }

    // if (Array.isArray(value)) {
    //   if (typeof value[0] === 'number') {
    //     return setMultiValue(value as number[])
    //   }

    //   if (typeof value[0] === 'string' && idItem) {
    //     const idIsExist = valTags.find((item) => item.id === idItem)
    //     if (!idIsExist) {
    //       const newData = [...valTags, { id: idItem, data: value as string[] }]
    //       return setValTags(newData)
    //     }
    //     const newData = valTags.map((item) => {
    //       if (item.id === idItem) {
    //         return { id: idItem, data: value as string[] }
    //       }
    //       return item
    //     })
    //     return setValTags(newData)
    //   }

    //   return setValCategories(value as ITreeItem[])
    // }

    // if (typeof value === 'number') {
    //   const newData = multiValue.filter((val) => val !== value)
    //   setMultiValue(newData)
    // }

    // if (!value && idItem) {
    //   const newData = data.map((item) => {
    //     if (idItem === item.id) {
    //       return {
    //         ...item,
    //         disabled: !item.disabled,
    //       }
    //     }
    //     return item
    //   })
    //   setData(newData)
    // }

    // return null
  }

  // useEffect(() => {
  //   const newData = data.map((item) =>
  //     multiValue.find((val) => val === item.value)
  //       ? { ...item, isSelected: true }
  //       : { ...item, isSelected: false }
  //   )
  //   setData(newData)
  //   // eslint-disable-next-line
  // }, [multiValue])

  // console.log('dataGeneral', dataGeneral)

  return (
    <RequestTypeComponent
      {...args}
      // data={data}
      onChange={onChange}
      multiValue={multiValue}
      valTags={valTags}
      dataCategories={categories.categories}
      valCategories={valCategories}
      requestTypesOptions={requestTypesOptions}
      dataGeneral={dataGeneral}
      limitationsTypes={limitationsTypes}
      textOperatorOptions={textOperatorOptions}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  width: 200,
  margin: 'normal',
  required: true,
  helperText: 'Good',
  helperIcon: 'checkmark',
  label: 'Label',
  disabled: false,
  error: false,
  fullWidth: false,
  infoTooltip: '',
}
