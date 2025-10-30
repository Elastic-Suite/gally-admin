import React, { ReactNode, useEffect, useRef } from 'react'
import { styled } from '@mui/system'

const defaultLeftWidth = 402

const Sentinel = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '84px',
})

const CustomRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
})

const CustomLeftSide = styled('div')<{ width: number }>(({ width }) => ({
  width,
  boxSizing: 'border-box',
  flexShrink: 0,
}))

const CustomBorder = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
}))

const Sticky = styled(CustomBorder)<{ width: number }>(({ theme, width }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.colors.white,
  position: 'sticky',
  top: '100px',
  alignSelf: 'flex-start',
  width,
  maxHeight: 'calc(100vh - 115px)',
  boxSizing: 'border-box',
  '&.fixed': {
    position: 'fixed',
  },
}))

const CustomRightSide = styled('div')<{ leftWidth: number }>(
  ({ leftWidth }) => ({
    width: `calc(100% - ${leftWidth - 25}px)`,
    boxSizing: 'border-box',
    paddingLeft: '25px',
  })
)

interface IProps {
  left: ReactNode[] | ReactNode
  children: ReactNode
  leftWidth?: number
}

function TwoColsLayout({ left, children, leftWidth }: IProps): JSX.Element {
  const colRef = useRef<HTMLDivElement>()
  const sentinelRef = useRef<HTMLDivElement>()

  const realLeftSideWidth = leftWidth ?? defaultLeftWidth

  useEffect(() => {
    function handler(entries: IntersectionObserverEntry[]): void {
      if (!entries[0].isIntersecting) {
        colRef.current?.classList.add('fixed')
      } else {
        colRef.current?.classList.remove('fixed')
      }
    }

    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      const observer = new window.IntersectionObserver(handler)
      observer.observe(sentinelRef.current)
      return () => observer.disconnect()
    }
  }, [])

  return (
    <>
      <Sentinel ref={sentinelRef} />
      <CustomRoot>
        <CustomLeftSide width={realLeftSideWidth}>
          <Sticky ref={colRef} width={realLeftSideWidth}>
            {left}
          </Sticky>
        </CustomLeftSide>
        <CustomRightSide leftWidth={realLeftSideWidth}>
          {children}
        </CustomRightSide>
      </CustomRoot>
    </>
  )
}

export default TwoColsLayout
