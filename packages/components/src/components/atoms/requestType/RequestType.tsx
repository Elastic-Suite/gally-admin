import React, { FormEvent, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import DropDown from '../form/DropDown'
import ItemRequestType from './ItemRequestType'
import { IRequestType, ITreeItem } from '@elastic-suite/gally-admin-shared'

const CustomRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.colors.neutral[200],
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  lineHeight: '18px',
}))

const CustomFirstSelectedAlone = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
  '::before': {
    content: "''",
    position: 'absolute',
    border: '1px dotted',
    height: '41px',
    width: '24px',
    borderRight: 'none',
    borderTop: 'none',
    top: '-32px',
    left: '-24px',
  },
}))

const CustomFirstSelectedMultiple = styled(CustomFirstSelectedAlone)({
  '::after': {
    content: "''",
    position: 'absolute',
    border: '1px dotted',
    height: `calc(100% + 30px)`,
    width: '24px',
    borderRight: 'none',
    borderTop: 'none',
    left: '-24px',
    top: '10px',
  },
})

const CustomLastSelectedMultiple = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
}))

const CustomSelected = styled(CustomLastSelectedMultiple)({
  '::after': {
    content: "''",
    position: 'absolute',
    border: '1px dotted',
    height: `calc(100% + 33px)`,
    width: '24px',
    borderRight: 'none',
    borderTop: 'none',
    top: '9px',
    left: '-24px',
  },
})

interface IProps {
  data: IRequestType[]
  // eslint-disable-next-line
  handleChange: (value: any) => void // il  y a problème de tipage dans le compo DropDown
  multiValue: number[] | []
  handleRemoveDataTag: (idItem: string, idTag: number) => void
  handleAddDataTag: (idItem: string, event?: FormEvent<HTMLFormElement>) => void
  inputVal: Record<string, string> | undefined
  handleChangeInput: (idItem: string, value: string) => void
  handleChangeSelectAll: (idItem: string) => void
  dataCategories: ITreeItem[]
  valCategories: ITreeItem[]
  setValCategories: (value: ITreeItem[], event: SyntheticEvent) => void
}

function RequestType(props: IProps): JSX.Element {
  const {
    data,
    handleChange,
    multiValue,
    handleRemoveDataTag,
    handleAddDataTag,
    inputVal,
    handleChangeInput,
    handleChangeSelectAll,
    dataCategories,
    valCategories,
    setValCategories,
  } = props

  return (
    <CustomRoot>
      <DropDown
        placeholder={
          data.find((item) => item.isSelected) ? '' : 'Add request type'
        }
        multiple
        onChange={handleChange}
        value={multiValue}
        options={data}
      />
      {data
        .filter((item) => item.isSelected)
        .map((item, key) => {
          if (key === 0) {
            const CustomDiv =
              multiValue.length === 1
                ? CustomFirstSelectedAlone
                : CustomFirstSelectedMultiple
            return (
              <CustomDiv key={item.id}>
                <ItemRequestType
                  data={item}
                  handleChangeSelectAll={handleChangeSelectAll}
                  handleRemoveDataTag={handleRemoveDataTag}
                  handleAddDataTag={handleAddDataTag}
                  handleChangeInput={handleChangeInput}
                  inputVal={inputVal}
                  setValCategories={setValCategories}
                  dataCategories={dataCategories}
                  valCategories={valCategories}
                />
              </CustomDiv>
            )
          }
          const CustomDiv =
            key + 1 < multiValue.length
              ? CustomSelected
              : CustomLastSelectedMultiple

          return (
            <CustomDiv key={item.id}>
              <ItemRequestType
                data={item}
                handleChangeSelectAll={handleChangeSelectAll}
                handleRemoveDataTag={handleRemoveDataTag}
                handleAddDataTag={handleAddDataTag}
                handleChangeInput={handleChangeInput}
                inputVal={inputVal}
                dataCategories={dataCategories}
                setValCategories={setValCategories}
                valCategories={valCategories}
              />
            </CustomDiv>
          )
        })}
    </CustomRoot>
  )
}

export default RequestType
