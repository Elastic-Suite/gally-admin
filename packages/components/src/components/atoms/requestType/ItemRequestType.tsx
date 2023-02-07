import React, { FormEvent, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import TextFieldTags from '../form/TextFieldTags'
import TreeSelector from '../form/TreeSelector'
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
  handleRemoveDataTag: (idItem: string, idTag: number) => void
  handleAddDataTag: (idItem: string, event?: FormEvent<HTMLFormElement>) => void
  inputVal: Record<string, string> | undefined
  handleChangeInput: (idItem: string, value: string) => void
  handleChangeSelectAll: (idItem: string) => void
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  setValCategories: (value: ITreeItem[], event: SyntheticEvent) => void
  handleRemoveSelect: (value: number) => void
  width?: number
}

function ItemRequestType(props: IProps): JSX.Element {
  const {
    data,
    handleRemoveDataTag,
    handleAddDataTag,
    inputVal,
    handleChangeInput,
    handleChangeSelectAll,
    dataCategories,
    setValCategories,
    valCategories,
    handleRemoveSelect,
    width = 190,
  } = props

  const isAllSelected = Boolean(data.data.find((a) => a?.id === -1))

  return (
    <CustomRoot>
      <CustomFullRequestType>
        <div style={{ width: `${width}px` }}>{data.label}</div>
        <div style={{ width: `${width}px` }}>
          <Checkbox
            label={data.labelIsAll}
            small
            checked={isAllSelected}
            onChange={(): void => handleChangeSelectAll(data.id)}
            list
          />
        </div>
        {data.type === 'tags' && (
          <TextFieldTags
            data={data}
            handleRemoveDataTag={handleRemoveDataTag}
            handleAddDataTag={handleAddDataTag}
            handleChangeInput={handleChangeInput}
            inputVal={inputVal}
          />
        )}
        {data.type === 'products' && (
          <TextFieldTags
            data={data}
            handleRemoveDataTag={handleRemoveDataTag}
            handleAddDataTag={handleAddDataTag}
            handleChangeInput={handleChangeInput}
            inputVal={inputVal}
          />
        )}
        {data.type === 'categories' && (
          <TreeSelector
            value={isAllSelected ? [] : valCategories}
            data={dataCategories}
            multiple
            onChange={setValCategories}
            disabled={isAllSelected}
            placeholder={isAllSelected ? data.labelIsAll : ''}
          />
        )}
      </CustomFullRequestType>
      <>
        <IconButton onClick={(): void => handleRemoveSelect(data.value)}>
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
