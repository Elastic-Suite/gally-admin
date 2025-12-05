import { useEffect } from 'react'
import Router from 'next/router'

export function AdminImportExport(): null {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Router.push('/admin/importexport/import')
    }
  }, [])

  return null
}

export default AdminImportExport
