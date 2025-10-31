import { useLayoutEffect, useState } from 'react'
import { IHorizontalOverflow } from '@elastic-suite/gally-admin-shared'

export const useIsHorizontalOverflow = (
  current: HTMLDivElement
): IHorizontalOverflow => {
  const [isOverflow, setIsOverflow] = useState(false)
  const [shadow, setShadow] = useState(false)
  const [isAtEnd, setIsAtEnd] = useState(false)

  useLayoutEffect(() => {
    function trigger(): () => void {
      if (current) {
        const hasOverflow = current.scrollWidth > current.clientWidth
        setIsOverflow(hasOverflow)
        if (hasOverflow) {
          const handleScroll = (event: UIEvent): void => {
            const target = event.target as HTMLElement
            const { clientWidth, scrollLeft, scrollWidth } = target
            setShadow(scrollLeft > 0)
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 20)
          }
          current.addEventListener('scroll', handleScroll)
          return () => current.removeEventListener('scroll', handleScroll)
        }
      }
    }

    trigger()
  }, [current])

  return { isAtEnd, isOverflow, shadow }
}
