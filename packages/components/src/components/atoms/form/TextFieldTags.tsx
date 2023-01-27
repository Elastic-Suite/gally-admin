import React, { FormEvent } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'
import { ITextFieldTags } from '@elastic-suite/gally-admin-shared'

const CustomRootTextFieldTags = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[600],
  width: '350px',
  boxSizing: 'border-box',
  gap: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}))

const CustomForm = styled('form')({
  width: '100%',
  '& .MuiFormControl-root': {
    width: '100%',
  },
})

const CustomTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  flexWrap: 'wrap',
}))

const CustomTextField = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
}))

const CustomBtnAdd = styled('div')(({ theme }) => ({
  color: theme.palette.colors.secondary[700],
  fontSize: theme.spacing(1.8),
  fontFamily: 'var(--gally-font)',
  padding: theme.spacing(1),
  borderRadius: '50%',
  position: 'relative',
  ':hover': {
    cursor: 'pointer',
    background: 'rgba(0, 0, 0, 0.04)',
  },
  '::after': {
    content: "''",
    background: theme.palette.colors.secondary[700],
    height: '1px',
    width: `calc(100% - 16px)`,
    position: 'absolute',
    left: theme.spacing(1),
    bottom: '4px',
  },
}))

interface IProps {
  data: ITextFieldTags
  handleRemoveDataTag: (idItem: string, idTag: number) => void
  handleAddDataTag: (idItem: string, event?: FormEvent<HTMLFormElement>) => void
  inputVal: Record<string, string> | undefined
  handleChangeInput: (idItem: string, value: string) => void
  isDisabled?: boolean
}

function TextFieldTags(props: IProps): JSX.Element {
  const {
    data,
    handleRemoveDataTag,
    handleAddDataTag,
    inputVal,
    handleChangeInput,
    isDisabled,
  } = props

  const isAllSelected =
    Boolean(data.data.find((a) => a?.id === -1)) || isDisabled

  return (
    <CustomRootTextFieldTags
      style={{ filter: isAllSelected ? 'grayscale(100%)' : '' }}
    >
      {data.data.length !== 0 && (
        <CustomTags>
          {data.data.map((item) => {
            return isAllSelected ? (
              <Chip key={item.id} label={item.label} />
            ) : (
              <Chip
                key={item.id}
                label={item.label}
                onDelete={(): void => handleRemoveDataTag(data.id, item.id)}
              />
            )
          })}
        </CustomTags>
      )}
      {!isAllSelected && (
        <CustomTextField>
          <CustomForm onSubmit={(e): void => handleAddDataTag(data.id, e)}>
            <InputText
              value={inputVal?.[data.id]}
              size="small"
              sx={{ width: '100%' }}
              onChange={(value): void =>
                handleChangeInput(data.id, value as string)
              }
            />
          </CustomForm>
          <CustomBtnAdd onClick={(): void => handleAddDataTag(data.id)}>
            Add
          </CustomBtnAdd>
        </CustomTextField>
      )}
    </CustomRootTextFieldTags>
  )
}

export default TextFieldTags
