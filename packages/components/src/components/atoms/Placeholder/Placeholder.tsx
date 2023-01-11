import React, { ReactNode, useContext } from 'react'
import { Box } from '@mui/system'

import { catalogContext } from '../../../contexts'

interface IProps {
  children: ReactNode
  placeholder: string
}

function Placeholder(props: IProps): JSX.Element {
  const { children, placeholder } = props
  const { localizedCatalogIdWithDefault } = useContext(catalogContext)

  return localizedCatalogIdWithDefault ? (
    <>{children}</>
  ) : (
    <Box
      sx={{
        fontSize: '12px',
        fontFamily: 'var(--gally-font)',
        lineHeight: '18px',
        padding: '16px 0  0 16px',
        color: 'colors.neutral.600',
      }}
    >
      {placeholder}
    </Box>
  )
}

export default Placeholder
