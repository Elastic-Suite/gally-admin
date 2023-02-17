import React from 'react'
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
  data: IRequestType
  value: Record<string, string> | undefined
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  width?: number
  Component: any
  disabled: boolean
  onChange: (
    value?: string[] | number[] | number | ITreeItem[],
    idItem?: string
  ) => void
}

function RequestTypeItem(props: IProps): JSX.Element {
  const {
    data,
    dataCategories,
    width,
    valCategories,
    Component,
    onChange,
    ...restProps
  } = props

  const isAllSelected = restProps.disabled

  return (
    <CustomRoot>
      <CustomFullRequestType>
        <div style={{ width: `${width}px` }}>{data.label}</div>
        <div style={{ width: `${width}px` }}>
          <Checkbox
            label={data.labelIsAll}
            small
            checked={isAllSelected}
            onChange={(): void => onChange(undefined, data.id)}
            list
          />
        </div>
        <Component
          data={dataCategories || data}
          onChange={onChange}
          {...restProps}
        />
      </CustomFullRequestType>
      <IconButton onClick={(): void => onChange(data.value)}>
        <IonIcon style={{ fontSize: '18px', color: '#424880' }} name="close" />
      </IconButton>
    </CustomRoot>
  )
}

RequestTypeItem.defaultProps = {
  width: 190,
}

export default RequestTypeItem
