import { defaultPageSize } from '../constants'
import {
  clearParameters,
  getAppUrl,
  getListApiParameters,
  getListParameters,
  getPageParameter,
  getParametersFromUrl,
  getRouterPath,
  getRouterUrl,
  getSearchParameter,
  getUrl,
} from './url'
import { createUTCDateSafe } from './format'

describe('URL service', () => {
  describe('getUrl', () => {
    it('should return an URL object from an string', () => {
      expect(getUrl('http://localhost/test').href).toEqual(
        'http://localhost/test'
      )
    })

    it('should return an URL object from an URL object', () => {
      expect(getUrl(new URL('http://localhost/test')).href).toEqual(
        'http://localhost/test'
      )
    })

    it('should return an URL object with parameters', () => {
      expect(getUrl('http://localhost/test', { foo: 'bar' }).href).toEqual(
        'http://localhost/test?foo=bar'
      )
    })

    it('should return an URL object with array parameters', () => {
      expect(
        getUrl('http://localhost/test', { 'foo[]': ['bar', 'baz'] }).href
      ).toEqual('http://localhost/test?foo%5B%5D=bar&foo%5B%5D=baz')
    })

    it('should return an URL object with between parameters', () => {
      expect(
        getUrl('http://localhost/test', { 'coverage[between]': [80, 90] }).href
      ).toEqual('http://localhost/test?coverage%5Bbetween%5D=80-90')
      expect(
        getUrl('http://localhost/test', { 'coverage[between]': ['', 90] }).href
      ).toEqual('http://localhost/test?coverage%5Bbetween%5D=-90')
      expect(
        getUrl('http://localhost/test', { 'coverage[between]': [80, ''] }).href
      ).toEqual('http://localhost/test?coverage%5Bbetween%5D=80-')
    })
  })

  describe('clearParameters', () => {
    it('should clear URL parameters', () => {
      const url = new URL('http://localhost/?foo=bar')
      expect(clearParameters(url).href).toEqual('http://localhost/')
    })
  })

  describe('getListParameters', () => {
    it('should get list parameters with default values', () => {
      expect(getListParameters()).toEqual({})
    })

    it('should get list parameters with pagination', () => {
      expect(getListParameters(1, { foo: 'bar' }, 'baz')).toEqual({
        currentPage: 1,
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get list parameters without pagination', () => {
      expect(getListParameters(false, { foo: 'bar' }, 'baz')).toEqual({
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should add prefix to parameters, search and page when prefix is used', () => {
      const parametersWithAndWithoutPrefix = { foo: 'bar', baz: 'qux' }
      expect(
        getListParameters(1, parametersWithAndWithoutPrefix, 'baz', 'prefix')
      ).toEqual({
        prefix_baz: 'qux',
        prefix_currentPage: 1,
        prefix_foo: 'bar',
        prefix_search: 'baz',
      })
    })
  })

  describe('getListApiParameters', () => {
    it('should get API list parameters with default values', () => {
      expect(getListApiParameters()).toEqual({
        currentPage: 1,
        pagination: true,
        pageSize: 50,
      })
    })

    it('should get API list parameters with pagination', () => {
      expect(
        getListApiParameters(1, defaultPageSize, { foo: 'bar' }, 'baz')
      ).toEqual({
        currentPage: 2,
        pagination: true,
        pageSize: 50,
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get API list parameters without pagination', () => {
      expect(
        getListApiParameters(false, undefined, { foo: 'bar' }, 'baz')
      ).toEqual({
        pagination: false,
        foo: 'bar',
        search: 'baz',
      })
    })
  })

  describe('getRouterUrl', () => {
    it('should get absolute URL from router path', () => {
      const url = getRouterUrl('/test')
      expect(url.href).toEqual('http://localhost/test')
    })
  })

  describe('getRouterPath', () => {
    it('should get the router path without parameters', () => {
      expect(getRouterPath('/test?foo=bar')).toEqual('/test')
    })
  })

  describe('getAppUrl', () => {
    it('should get the app URL with default parameters', () => {
      const url = getAppUrl('/test')
      expect(url.href).toEqual('http://localhost/test')
    })

    it('should get the app URL with parameters', () => {
      const url = getAppUrl('/test', 1, { foo: 'bar' }, 'baz')
      expect(url.href).toEqual(
        'http://localhost/test?foo=bar&currentPage=1&search=baz'
      )
    })

    it('should get the app URL with parameters and prefix', () => {
      const url = getAppUrl('/test', 1, { foo: 'bar' }, 'baz', 'prefix')
      expect(url.href).toEqual(
        'http://localhost/test?prefix_foo=bar&prefix_currentPage=1&prefix_search=baz'
      )
    })
  })

  describe('getParametersFromUrl', () => {
    it('should get the parameters from an URL', () => {
      const url = new URL(
        'http://localhost/test?currentPage=1&foo=bar&search=baz'
      )
      expect(getParametersFromUrl(url)).toEqual({
        currentPage: '1',
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get the array parameters from an URL', () => {
      const url = new URL('http://localhost/test?foo[]=bar&foo[]=baz')
      expect(getParametersFromUrl(url)).toEqual({
        'foo[]': ['bar', 'baz'],
      })
    })

    it('should get the between parameters from an URL', () => {
      const url = new URL('http://localhost/test?coverage[between]=80-90')
      expect(getParametersFromUrl(url)).toEqual({
        'coverage[between]': ['80', '90'],
      })
    })

    it('should parse between date range from URL search params', () => {
      const url = new URL(
        'https://localhost/test?finishedAt%5Bbetween%5D=12%2F02%2F2026+00%3A00%3A00-13%2F02%2F2026+23%3A59%3A59'
      )
      const params = getParametersFromUrl(url)
      const [startDate, endDate] = params['finishedAt[between]'] as Date[]
      expect(startDate).toBeInstanceOf(Date)
      expect(endDate).toBeInstanceOf(Date)
      expect(createUTCDateSafe(startDate).toISOString().split('T')[0]).toBe(
        '2026-02-12'
      )
      expect(createUTCDateSafe(endDate).toISOString().split('T')[0]).toBe(
        '2026-02-13'
      )
    })

    it('should get all the parameters from an URL when there is no prefix', () => {
      const url = new URL(
        'http://localhost/test?prefix_currentPage=1&prefix_foo=bar&baz=qux&prefix_search=baz'
      )
      expect(getParametersFromUrl(url)).toEqual({
        baz: 'qux',
        prefix_currentPage: '1',
        prefix_foo: 'bar',
        prefix_search: 'baz',
      })
    })

    it('should only get get the parameters from an URL when the prefix matches', () => {
      const url = new URL(
        'http://localhost/test?prefix_currentPage=1&prefix_foo=bar&baz=qux&prefix_search=baz'
      )
      expect(getParametersFromUrl(url, 'prefix')).toEqual({
        currentPage: '1',
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get what matches the prefix and ignore the rest for parameters, page and search', () => {
      const url = new URL(
        'http://localhost/test?anotherprefix_currentPage=1&prefix_foo=bar&baz=qux&anotherprefix_search=baz'
      )
      expect(getParametersFromUrl(url, 'prefix')).toEqual({
        foo: 'bar',
      })
    })
  })

  describe('getPageParameter', () => {
    it('should get the page parameter', () => {
      expect(
        getPageParameter({
          currentPage: '1',
          foo: 'bar',
          search: 'baz',
        })
      ).toEqual(1)
    })

    it('should return the default page', () => {
      expect(getPageParameter({})).toEqual(0)
    })

    it('should get the page parameter when prefixed', () => {
      expect(
        getPageParameter(
          {
            prefix_currentPage: '2',
            foo: 'bar',
            search: 'baz',
          },
          'prefix'
        )
      ).toEqual(2)
    })

    it('should ignore the page parameter when prefix do not match', () => {
      expect(
        getPageParameter(
          {
            prefix_currentPage: '2',
            foo: 'bar',
            search: 'baz',
          },
          'anotherprefix'
        )
      ).toEqual(0)
    })
  })

  describe('getSearchParameter', () => {
    it('should get the page parameter', () => {
      expect(
        getSearchParameter({
          currentPage: '1',
          foo: 'bar',
          search: 'baz',
        })
      ).toEqual('baz')
    })

    it('should get the search parameter when prefixed', () => {
      expect(
        getSearchParameter(
          {
            currentPage: '1',
            foo: 'bar',
            prefix_search: 'baz',
          },
          'prefix'
        )
      ).toEqual('baz')
    })

    it('should ignore the search parameter when prefix do not match', () => {
      expect(
        getSearchParameter(
          {
            currentPage: '1',
            foo: 'bar',
            prefix_search: 'baz',
          },
          'anotherprefix'
        )
      ).toEqual('')
    })

    it('should return the default page', () => {
      expect(getSearchParameter({})).toEqual('')
    })
  })
})
