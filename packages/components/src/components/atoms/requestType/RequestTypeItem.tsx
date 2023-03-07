import React, { useState } from 'react'
import { styled } from '@mui/system'
import { IRequestType, ITreeItem } from '@elastic-suite/gally-admin-shared'
import { IconButton } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import Checkbox from '../form/Checkbox'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  flexDirection: 'row',
  alignItems: 'center',
}))

const CustomFullRequestType = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'row',
}))

interface IProps {
  // data: IRequestType
  // value: Record<string, string> | undefined
  // dataCategories: ITreeItem[]
  // valCategories: ITreeItem[]
  width?: number
  Component: any
  // disabled: boolean
  // onChange: (
  //   value?: string[] | number[] | number | ITreeItem[],
  //   idItem?: string
  // ) => void
  limiTationType: any
  requestType: any
  data: any
  onChange: (
    description: string,
    value?: string[] | ITreeItem[],
    idItem?: string,
    operator?: any
  ) => void
  textOperatorOptions: any
}

function RequestTypeItem(props: IProps): JSX.Element {
  const {
    // data,
    // dataCategories,
    width,
    // valCategories,
    Component,
    onChange,
    limiTationType,
    requestType,
    data,
    textOperatorOptions,
    ...restProps
  } = props

  // console.log(
  //   'data',
  //   data.map((item) => item.queryText)
  // )
  console.log('data', data)
  const initOperator = ''
  const [activeOperator, setActiveOperator] = useState([])

  return (
    <CustomRoot>
      <CustomFullRequestType>
        <div style={{ width: `${width}px` }}>{limiTationType.label}</div>
        <div style={{ width: `${width}px` }}>
          <Checkbox
            label={limiTationType.labelIsAll}
            small
            checked={requestType.applyToAll}
            onChange={(): void =>
              onChange('allSelected', undefined, requestType.requestType)
            }
            list
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {textOperatorOptions.map((item) => {
            return (
              <div key={item?.id || item.queryText + item.operator}>
                <div>{item.label}</div>
                <Component
                  value={data
                    .filter((it) => it.operator === item.value)
                    .map((it) => it.queryText)}
                  onChange={(a) =>
                    onChange('data', a, limiTationType.value, item.value)
                  }
                  disabled={requestType.applyToAll}
                  disabledValue={limiTationType.labelIsAll}
                  {...restProps}
                />
              </div>
            )
          })}
        </div>
      </CustomFullRequestType>
      <IconButton
        onClick={(): void =>
          onChange('optionsDropdown', requestType.requestType)
        }
      >
        <IonIcon style={{ fontSize: '18px', color: '#424880' }} name="close" />
      </IconButton>
    </CustomRoot>
  )
}

RequestTypeItem.defaultProps = {
  width: 190,
}

export default RequestTypeItem
