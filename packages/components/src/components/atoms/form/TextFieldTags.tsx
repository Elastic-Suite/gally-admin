import React, { FormEvent } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'

const CustomRoot = styled('div')(({ theme }) => ({
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
  dataTags: { id: number; label: string }[]
  handleRemoveDataTag: (value: number) => void
  handleAddDataTag: (event?: FormEvent<HTMLFormElement>) => void
  inputVal: string
  setInputVal: (value: string) => void
  isDisabled: boolean
}

function TextFieldTags(props: IProps): JSX.Element {
  const {
    dataTags,
    handleRemoveDataTag,
    handleAddDataTag,
    inputVal,
    setInputVal,
    isDisabled,
  } = props
  return (
    <CustomRoot style={{ filter: isDisabled ? 'grayscale(100%)' : '' }}>
      {dataTags.length !== 0 && (
        <CustomTags>
          {dataTags.map((item) => {
            return isDisabled ? (
              <Chip key={item.id} label={item.label} />
            ) : (
              <Chip
                key={item.id}
                label={item.label}
                onDelete={(): void => handleRemoveDataTag(item.id)}
              />
            )
          })}
        </CustomTags>
      )}
      {!isDisabled && (
        <CustomTextField>
          <form onSubmit={handleAddDataTag}>
            <InputText
              value={inputVal}
              size="small"
              sx={{ width: '100%' }}
              onChange={(value): void => setInputVal(value as string)}
            />
          </form>
          <CustomBtnAdd onClick={(): void => handleAddDataTag()}>
            Add
          </CustomBtnAdd>
        </CustomTextField>
      )}
    </CustomRoot>
  )
}

export default TextFieldTags
