import { useEffect } from 'react'
import Router from 'next/router'

export function AdminAnalyzeImportExport(): null {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Router.push('/admin/analyze/importexport/import')
    }
  }, [])

  return null
}

export default AdminAnalyzeImportExport
