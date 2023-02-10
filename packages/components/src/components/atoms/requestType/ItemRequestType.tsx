import React, { FormEvent, SyntheticEvent } from 'react'
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
  onChangeInput: (idItem: string, value: string) => void
  onChangeSelectAll: (idItem: string) => void
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  setValCategories: (value: ITreeItem[], event: SyntheticEvent) => void
  onRemoveSelect: (value: number) => void
  width?: number
  onChange: (
    idItem: string,
    idTag: number | undefined,
    event?: FormEvent<HTMLFormElement>
  ) => void
  Component: any
  disabled: boolean
}

function ItemRequestType(props: IProps): JSX.Element {
  const {
    onRemoveSelect,
    data,
    dataCategories,
    onChangeSelectAll,
    width = 190,
    setValCategories,
    valCategories,
    Component,
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
            onChange={(): void => onChangeSelectAll(data.id)}
            list
          />
        </div>
        <Component data={dataCategories || data} {...restProps} />
      </CustomFullRequestType>
      <>
        <IconButton onClick={(): void => onRemoveSelect(data.value)}>
          <IonIcon
            style={{ fontSize: '18px', color: '#424880' }}
            name="close"
          />
        </IconButton>
      </>
    </CustomRoot>
  )
}

export default ItemRequestType
