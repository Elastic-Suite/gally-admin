import React, { useMemo } from 'react'
import { styled } from '@mui/system'
import TreeSelector from './TreeSelector'

import {
  ICategoryLimitations,
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  ISearchLimitations,
  ITreeItem,
  flatTree,
} from '@elastic-suite/gally-admin-shared'

import TextFieldTagsMultiple from './TextFieldTagsMultiple'

import { useTranslation } from 'next-i18next'

import Checkbox from './Checkbox'
import {
  CustomFirstSelectedItem,
  CustomRootItem,
  CustomSelectedItem,
} from './RequestTypeItem.styled'

const CustomItem = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'start',
}))

const CustomLabel = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  width: '130px',
  lineHeight: '18px',
}))

const CustomDataLimitations = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: '-12px',
}))

export interface IRequestTypeItem {
  value: IRequestType
  onChange: (value: IRequestType) => void
  options: IOptionsTags[]
  limitationsTypes: ILimitationsTypes[]
  requestTypesOptions: IRequestTypesOptions[]
  categoriesList: ITreeItem[]
}

interface IPropsComponent {
  disabled?: boolean
  onChange: (data: ITreeItem[] | ISearchLimitations[]) => void
}

function RequestTypeItem(props: IRequestTypeItem): JSX.Element {
  const {
    value,
    onChange,
    options,
    limitationsTypes,
    requestTypesOptions,
    categoriesList,
  } = props
  const { t } = useTranslation('common')

  function onChangeApplyToAll(
    idItem: IRequestTypesOptions[],
    val: boolean
  ): void {
    const requestTypeOptionValues = (idItem as IRequestTypesOptions[]).map(
      (it) => it.value
    )
    const newData = value.requestTypes.map((item) => {
      if (requestTypeOptionValues.includes(item.requestType)) {
        return { ...item, applyToAll: val }
      }
      return item
    })

    const requestTypeLimitationType: Record<string, []> = {
      // This constant is used to create an object with the '${limitationType}Limitations'
      // as the key corresponding to the selected 'requestTypeItem' line and an empty array as the value.
      // This new object allows resetting the values of the 'limitations' array when the checkbox is clicked.
      [`${(idItem as IRequestTypesOptions[]).find((it) => it.limitationType)
        .limitationType!}Limitations`]: [],
    }

    return onChange({
      ...value,
      ...requestTypeLimitationType,
      requestTypes: newData,
    })
  }
  function onChangeDataLimitations(
    idItem: string,
    val: ISearchLimitations[] | ITreeItem[]
  ): void {
    if (idItem === 'categoryLimitations') {
      const newData = (val as ITreeItem[]).map((item) => {
        return {
          category: `/categories/${item.id}`,
        }
      })
      return onChange({ ...value, [idItem]: newData })
    }
    return onChange({ ...value, [idItem]: val })
  }

  const flatCategories: ITreeItem[] = useMemo(() => {
    const flat: ITreeItem[] = []
    flatTree(categoriesList, flat)
    return flat
  }, [categoriesList])

  const limitationTypeMap = requestTypesOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.limitationType
      return acc
    },
    {}
  )

  return (
    <CustomRootItem>
      {limitationsTypes.map((item, key) => {
        const uniqLimitationTypes = new Set(
          value.requestTypes.map((item) => limitationTypeMap[item.requestType])
        )
        const countLines = uniqLimitationTypes.size

        const requestTypeRequestType = value.requestTypes.map(
          (item) => item.requestType
        )
        const requestTypeOption = requestTypesOptions.filter(
          (it) =>
            it.limitationType === item.value &&
            requestTypeRequestType.includes(it.value)
        )

        if (requestTypeOption.length === 0) {
          return null
        }

        const concatLabel = requestTypeOption.map((it) => it.label)

        const findValueInRequestTypesOptions = requestTypesOptions.find(
          (it) =>
            requestTypeRequestType.includes(it.value) &&
            it.limitationType === item.value
        )?.value

        const isApplyToAll = value.requestTypes.find(
          (it) => it.requestType === findValueInRequestTypesOptions
        )?.applyToAll

        const limitationsData: ISearchLimitations[] | ICategoryLimitations[] =
          value[`${item.value}Limitations` as keyof IRequestType] as
            | ISearchLimitations[]
            | ICategoryLimitations[]
        let uniqueLine = key + 1 < countLines
        let CustomDiv = CustomSelectedItem

        if (key === 0 || countLines === 1) {
          uniqueLine = countLines === 1
          CustomDiv = CustomFirstSelectedItem
        }

        const treeSelectorValue = flatCategories.filter((category) => {
          return (limitationsData as ICategoryLimitations[]).some(
            (it) => it?.category?.split('/')?.pop() === category.id
          )
        })

        const propsLimitations: IPropsComponent = {
          disabled: isApplyToAll,
          onChange: (data: ITreeItem[] | ISearchLimitations[]): void =>
            onChangeDataLimitations(`${item.value}Limitations`, data),
        }

        return (
          <CustomDiv key={item.value} uniqueLine={uniqueLine}>
            <CustomItem>
              <CustomLabel>{concatLabel.join(' / ')}</CustomLabel>
              <div style={{ marginTop: '-12px', width: '150px' }}>
                <Checkbox
                  checked={isApplyToAll}
                  label={t(item.labelAll)}
                  onChange={(val: boolean): void =>
                    onChangeApplyToAll(requestTypeOption, val)
                  }
                />
              </div>
              <CustomDataLimitations>
                {item.value === 'search' && (
                  <TextFieldTagsMultiple
                    {...propsLimitations}
                    disabledValue={t(item.labelAll)}
                    options={options}
                    value={limitationsData as ISearchLimitations[]}
                  />
                )}

                {item.value === 'category' && (
                  <TreeSelector
                    {...propsLimitations}
                    value={isApplyToAll ? [] : treeSelectorValue}
                    placeholder={
                      isApplyToAll || treeSelectorValue.length === 0
                        ? propsLimitations.disabled
                          ? t(item.labelAll)
                          : t('placeholder.requestType.search')
                        : ''
                    }
                    data={categoriesList}
                    multiple
                  />
                )}
              </CustomDataLimitations>
            </CustomItem>
          </CustomDiv>
        )
      })}
    </CustomRootItem>
  )
}

export default RequestTypeItem
