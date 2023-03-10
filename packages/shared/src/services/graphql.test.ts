import { fetchJson } from '../services/fetch'
import { storageGet } from '../services/storage'

import { GraphqlError, fetchGraphql, isGraphqlError } from './graphql'
import { AuthError } from './network'

jest.mock('../services/fetch')
jest.mock('../services/storage')

const testQuery = `query {
  catalogs {
    edges {
      node {
        id
      }
    }
  }
}`

describe('Graphql service', () => {
  describe('isGraphqlError', () => {
    it('should check if response is an API error', () => {
      expect(isGraphqlError({ errors: [] })).toEqual(true)
      expect(isGraphqlError({ hello: 'world' })).toEqual(false)
    })
  })

  describe('fetchGraphql', () => {
    it('should fetch requested query', async () => {
      ;(fetchJson as jest.Mock).mockClear()
      await fetchGraphql('en', testQuery)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Gally-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })

    it('should add auth header if user is connected', async () => {
      const mock = storageGet as jest.Mock
      mock.mockClear()
      ;(fetchJson as jest.Mock).mockClear()
      mock.mockImplementationOnce(() => 'token')
      await fetchGraphql('en', testQuery, undefined, undefined, true)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
          'Gally-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })

    it('should throw an error (GraphqlError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: { errors: [{ message: 'error' }] } })
      )
      await expect(fetchGraphql('en', testQuery)).rejects.toThrow(GraphqlError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Gally-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })

    it('should throw an (AuthError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: {}, response: { status: 401 } })
      )
      await expect(fetchGraphql('en', testQuery)).rejects.toThrow(AuthError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Gally-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })
  })
})
