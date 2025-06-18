import React, { ReactNode } from 'react'

import { styled } from '@mui/system'

import Image from 'next/image'

const CustomRoot = styled('div')({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  background: 'rgb(250, 251, 254)',
})

const CustomImg = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
})

const CustomBloc = styled('div')({
  padding: '32px',
  marginBottom: '6%',
  border: '1px solid rgb(226, 230, 243)',
  borderRadius: '8px',
  background: 'rgb(255, 255, 255)',
  minWidth: '33%',
})

interface IProps {
  children: ReactNode
}

function BlankLayout({ children }: IProps): JSX.Element {
  return (
    <CustomRoot>
      <CustomBloc>
        <CustomImg>
          <Image
            src="/images/LogoBlinkExtended.svg"
            alt="Logo"
            width="150"
            height="45"
          />
        </CustomImg>
        {children}
      </CustomBloc>
    </CustomRoot>
  )
}

export default BlankLayout
