import React, { ReactNode } from 'react'
import { styled } from '@mui/system'
import Checkbox from '../form/Checkbox'
import { ITextFieldTags } from '@elastic-suite/gally-admin-shared'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'row',
}))

interface IProps {
  data: ITextFieldTags
  handleChangeSelectAll: (idItem: string) => void
  width?: number
  children: ReactNode
}

function FullRequestType(props: IProps): JSX.Element {
  const { data, handleChangeSelectAll, width = 190, children } = props
  const isAllSelected = Boolean(data.data.find((a) => a?.id === -1))

  return (
    <CustomRoot>
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
      {children}
    </CustomRoot>
  )
}

export default FullRequestType
