import { useEffect } from 'react'
import Router from 'next/router'

function Welcome(): void {
  useEffect(() => {
    Router.push('/login')
  }, [])
  return null
}

export default Welcome
