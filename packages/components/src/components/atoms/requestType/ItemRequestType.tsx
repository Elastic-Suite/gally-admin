import React, { FormEvent, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import TextFieldTags from '../form/TextFieldTags'
import TreeSelector from '../form/TreeSelector'
import { IRequestType, ITreeItem } from '@elastic-suite/gally-admin-shared'
import FullRequestType from '../fullRequestType/FullRequestType'

const CustomRoot = styled('div')(({ theme }) => ({
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
  } = props

  const isAllSelected = Boolean(data.data.find((a) => a?.id === -1))

  if (isAllSelected) {
    return (
      <CustomRoot>
        <FullRequestType
          handleChangeSelectAll={handleChangeSelectAll}
          data={data}
        >
          {isAllSelected ? (
            <TextFieldTags
              data={data}
              handleRemoveDataTag={handleRemoveDataTag}
              handleAddDataTag={handleAddDataTag}
              handleChangeInput={handleChangeInput}
              inputVal={inputVal}
            />
          ) : null}
        </FullRequestType>
      </CustomRoot>
    )
  }

  return (
    <CustomRoot>
      <FullRequestType
        handleChangeSelectAll={handleChangeSelectAll}
        data={data}
      >
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
            value={valCategories}
            data={dataCategories}
            multiple
            onChange={setValCategories}
          />
        )}
      </FullRequestType>
    </CustomRoot>
  )
}

export default ItemRequestType
