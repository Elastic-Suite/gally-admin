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
  justifyContent: 'center',
  minHeight: '54px',
}))

const CustomRootTextFieldTagsDisabled = styled(CustomRootTextFieldTags)(
  ({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderColor: theme.palette.colors.neutral[300],
    color: theme.palette.colors.neutral[500],
    background: theme.palette.colors.neutral[300],
    width: 'auto',
    maxWidth: '350px',
    minWidth: '180px',
  })
)

const CustomTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  flexWrap: 'wrap',
}))

const CustomLabelDisabled = styled('div')({
  fontSize: '14px',
  fontWeight: '400',
  cursor: 'default',
})

interface IProps {
  data: ITextFieldTags
  handleRemoveDataTag: (idItem: string, idTag: number) => void
  handleAddDataTag: (idItem: string, event?: FormEvent<HTMLFormElement>) => void
  inputVal: Record<string, string> | undefined
  handleChangeInput: (idItem: string, value: string) => void
  disabled?: boolean
}

function TextFieldTags(props: IProps): JSX.Element {
  const {
    data,
    handleRemoveDataTag,
    handleAddDataTag,
    inputVal,
    handleChangeInput,
    disabled,
  } = props

  const isDisabled = Boolean(data.data.find((a) => a?.id === -1)) || disabled
  const CustomRoot = isDisabled
    ? CustomRootTextFieldTagsDisabled
    : CustomRootTextFieldTags
  return (
    <CustomRoot>
      <CustomTags
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {data.data.map((item) => {
          return isDisabled ? (
            item.id === -1 && (
              <CustomLabelDisabled>{item.label}</CustomLabelDisabled>
            )
          ) : (
            <Chip
              key={item.id}
              label={item.label}
              onDelete={(): void => handleRemoveDataTag(data.id, item.id)}
            />
          )
        })}
        {!isDisabled && (
          <form
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onSubmit={(e): void => handleAddDataTag(data.id, e)}
          >
            <InputText
              value={inputVal?.[data.id]}
              size="small"
              sx={{
                minWidth: 'auto',
                width: '146px',
                border: 'none',
                background: 'inherit',
                '&.MuiInputBase-root': { minHeight: 0, paddingLeft: '8px' },
              }}
              placeholder={data.label}
              onChange={(value): void =>
                handleChangeInput(data.id, value as string)
              }
            />
          </form>
        )}
      </CustomTags>
    </CustomRoot>
  )
}

export default TextFieldTags
