import { useRouter } from 'next/router'
import { resourceWithRef } from '@elastic-suite/gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import {
  useFilterParameters,
  useFilters,
  useFiltersRedirect,
  usePage,
  useSearch,
} from './useFilters'

describe('useFilters', () => {
  describe('useFiltersRedirect', () => {
    it('should not redirect if there is no need to redirect', () => {
      const router = useRouter()
      const pushSpy = router.push as jest.Mock
      pushSpy.mockClear()
      renderHookWithProviders(() => useFiltersRedirect())
      expect(pushSpy).not.toHaveBeenCalled()
    })

    it('should redirect with parameters', () => {
      const router = useRouter()
      const pushSpy = router.push as jest.Mock
      pushSpy.mockClear()
      renderHookWithProviders(() =>
        useFiltersRedirect(1, { foo: 'bar' }, 'baz')
      )
      expect(pushSpy).toHaveBeenCalledWith(
        'http://localhost/test?foo=bar&currentPage=1&search=baz',
        undefined,
        { shallow: true }
      )
    })

    it('should redirect with parameters and prefix', () => {
      const router = useRouter()
      const pushSpy = router.push as jest.Mock
      pushSpy.mockClear()
      renderHookWithProviders(() =>
        useFiltersRedirect(1, { foo: 'bar' }, 'baz', true, 'prefix')
      )
      expect(pushSpy).toHaveBeenCalledWith(
        'http://localhost/test?prefix_foo=bar&prefix_currentPage=1&prefix_search=baz',
        undefined,
        { shallow: true }
      )
    })

    it('should not redirect if active is false', () => {
      const router = useRouter()
      const pushSpy = router.push as jest.Mock
      pushSpy.mockClear()
      renderHookWithProviders(() =>
        useFiltersRedirect(1, { foo: 'bar' }, 'baz', false)
      )
      expect(pushSpy).not.toHaveBeenCalled()
    })
  })

  describe('usePage', () => {
    it('should get the default page state', () => {
      const { result } = renderHookWithProviders(() => usePage())
      expect(result.current[0]).toEqual(0)
    })

    it('should get the page state initialized from router parameter', () => {
      const router = useRouter()
      const oldPath = router.asPath
      router.asPath = '/test?currentPage=42'
      const { result } = renderHookWithProviders(() => usePage())
      expect(result.current[0]).toEqual(42)
      router.asPath = oldPath
    })

    it('should get the page state initialized from router parameter with prefix', () => {
      const router = useRouter()
      const oldPath = router.asPath
      router.asPath = '/test?prefix_currentPage=42'
      const { result } = renderHookWithProviders(() => usePage('prefix'))
      expect(result.current[0]).toEqual(42)
      router.asPath = oldPath
    })

    it('should get the page state initialized from router parameter only if prefix matches', () => {
      const router = useRouter()
      const oldPath = router.asPath
      router.asPath = '/test?currentPage=42'
      const { result } = renderHookWithProviders(() => usePage('prefix'))
      expect(result.current[0]).toEqual(0)
      router.asPath = oldPath
    })
  })

  describe('useFilters', () => {
    it('should get the default filters state', () => {
      const { result } = renderHookWithProviders(() =>
        useFilters(resourceWithRef)
      )
      expect(result.current[0]).toEqual({})
    })

    it('should get the filters state initialized from router parameter with implicit resource prefix', () => {
      const router = useRouter()
      const prefix = `${resourceWithRef.title.toLowerCase()}_`
      const oldPath = router.asPath
      router.asPath = `/test?${prefix}code=foo&${prefix}metadata[]=1&${prefix}metadata[]=2&${prefix}isSearchable=true`
      const { result } = renderHookWithProviders(() =>
        useFilters(resourceWithRef)
      )
      expect(result.current[0]).toEqual({
        code: 'foo',
        'metadata[]': [1, 2],
        isSearchable: true,
      })
      router.asPath = oldPath
    })

    it('should get the filters state initialized from router parameter with custom prefix', () => {
      const router = useRouter()
      const prefix = `customprefix_`
      const oldPath = router.asPath
      router.asPath = `/test?${prefix}code=foo&${prefix}metadata[]=1&${prefix}metadata[]=2&${prefix}isSearchable=true`
      const { result } = renderHookWithProviders(() =>
        useFilters(resourceWithRef, 'customprefix')
      )
      expect(result.current[0]).toEqual({
        code: 'foo',
        'metadata[]': [1, 2],
        isSearchable: true,
      })
      router.asPath = oldPath
    })

    it('should get the filters state initialized from router parameter that matches the implicit resource prefix', () => {
      const router = useRouter()
      const prefix = `${resourceWithRef.title.toLowerCase()}_`
      const oldPath = router.asPath
      router.asPath = `/test?${prefix}code=foo&${prefix}metadata[]=1&metadata[]=2&${prefix}isSearchable=true`
      const { result } = renderHookWithProviders(() =>
        useFilters(resourceWithRef)
      )
      expect(result.current[0]).toEqual({
        code: 'foo',
        'metadata[]': [1],
        isSearchable: true,
      })
      router.asPath = oldPath
    })

    it('should get the filters state initialized from router parameter that matches the custom resource prefix', () => {
      const router = useRouter()
      const prefix = `customprefix_`
      const oldPath = router.asPath
      router.asPath = `/test?${prefix}code=foo&metadata[]=1&${prefix}metadata[]=2&${prefix}isSearchable=true`
      const { result } = renderHookWithProviders(() =>
        useFilters(resourceWithRef, 'customprefix')
      )
      expect(result.current[0]).toEqual({
        code: 'foo',
        'metadata[]': [2],
        isSearchable: true,
      })
      router.asPath = oldPath
    })
  })

  describe('useSearch', () => {
    it('should get the default search state', () => {
      const { result } = renderHookWithProviders(() => useSearch())
      expect(result.current[0]).toEqual('')
    })

    it('should get the search state initialized from router parameter', () => {
      const router = useRouter()
      const oldPath = router.asPath
      router.asPath = '/test?search=foo'
      const { result } = renderHookWithProviders(() => useSearch())
      expect(result.current[0]).toEqual('foo')
      router.asPath = oldPath
    })

    it('should get the search state initialized from router parameter with prefix', () => {
      const router = useRouter()
      const oldPath = router.asPath
      router.asPath = '/test?prefix_search=foo'
      const { result } = renderHookWithProviders(() => useSearch('prefix'))
      expect(result.current[0]).toEqual('foo')
      router.asPath = oldPath
    })
  })

  describe('useFilterParameters', () => {
    it('should get the filter as parameters', () => {
      const { result } = renderHookWithProviders(() =>
        useFilterParameters({ foo: 'bar' }, { hello: 'world' })
      )
      expect(result.current).toEqual({
        foo: 'bar',
        hello: 'world',
      })
    })
  })
})
