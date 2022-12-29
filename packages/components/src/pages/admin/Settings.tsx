import { useEffect } from 'react'
import { useRouter } from 'next/router'

export function AdminSettings(): null {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/admin/settings/scope/catalogs')
    }
  })

  return null
}

export default AdminSettings
