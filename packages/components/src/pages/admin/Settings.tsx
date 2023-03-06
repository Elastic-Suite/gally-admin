import { useEffect } from 'react'
import Router from 'next/router'

export function AdminSettings(): null {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Router.push('/admin/settings/scope/catalogs')
    }
  }, [])

  return null
}

export default AdminSettings
