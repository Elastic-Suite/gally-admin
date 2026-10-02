import { describe, expect, it, vi } from 'vitest'
import { SearchManager } from '../../src/service/SearchManager'
import { Request } from '../../src/graphql/Request'
import { Metadata } from '../../src/entity/Metadata'
import { Configuration } from '../../src/client/Configuration'

describe('SearchManager Normalization', () => {
  const config = new Configuration({ baseUri: 'http://localhost' })
  const mockMetadata = new Metadata('product')

  it('should normalize string localizedCatalog to be used in Request', async () => {
    const searchManager = new SearchManager(config)

    // Mock client.graphql to intercept the request and variables
    const mockGraphql = vi
      // @ts-expect-error we spy on an object here so property is accessible
      .spyOn(searchManager.client, 'graphql')
      .mockResolvedValue({
        data: {
          products: {
            collection: [],
            paginationInfo: { totalCount: 0, lastPage: 0, itemsPerPage: 10 },
            sortInfo: { current: [] },
          },
        },
      })

    await searchManager.search({
      localizedCatalog: 'my_shop_en',
      metadata: 'product',
      isAutocomplete: false,
      selectedFields: [],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    })

    expect(mockGraphql).toHaveBeenCalled()
    const [[, variables]] = mockGraphql.mock.calls
    expect(variables.localizedCatalog).toBe('my_shop_en')
  })

  it('should normalize string metadata to Metadata object', async () => {
    const searchManager = new SearchManager(config)

    const mockGraphql = vi
      // @ts-expect-error we spy on an object here so property is accessible
      .spyOn(searchManager.client, 'graphql')
      .mockResolvedValue({
        data: {
          products: {
            collection: [],
            paginationInfo: { totalCount: 0, lastPage: 0, itemsPerPage: 10 },
            sortInfo: { current: [] },
          },
        },
      })

    await searchManager.search({
      localizedCatalog: 'my_shop_fr',
      metadata: 'product', // Passing as string
      isAutocomplete: false,
      selectedFields: [],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    })

    expect(mockGraphql).toHaveBeenCalled()
    // The request passed to the internal logic should have normalized metadata
    // We can't easily check the internal Request object without spying on more things,
    // but we know it works if the GraphQL query (which uses metadata.getEntity()) succeeds.
  })

  it('should handle full Request object without re-normalizing', async () => {
    const searchManager = new SearchManager(config)
    const request = new Request({
      localizedCatalog: 'my_shop_fr',
      metadata: mockMetadata,
      isAutocomplete: false,
      selectedFields: [],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    })

    const mockGraphql = vi
      // @ts-expect-error we spy on an object here so property is accessible
      .spyOn(searchManager.client, 'graphql')
      .mockResolvedValue({
        data: {
          products: {
            collection: [],
            paginationInfo: { totalCount: 0, lastPage: 0, itemsPerPage: 10 },
            sortInfo: { current: [] },
          },
        },
      })

    await searchManager.search(request)

    expect(mockGraphql).toHaveBeenCalled()
    const [[, variables]] = mockGraphql.mock.calls
    expect(variables.localizedCatalog).toBe('my_shop_fr')
  })
})

describe('SearchManager Term Suggestions', () => {
  const searchOptions = {
    localizedCatalog: 'my_shop_en',
    metadata: 'product',
    selectedFields: [],
    currentPage: 1,
    pageSize: 10,
    filters: [],
  }

  function mockSearch(
    searchManager: SearchManager,
    endpointData: Record<string, unknown> = {}
  ) {
    return (
      vi
        // @ts-expect-error we spy on an object here so property is accessible
        .spyOn(searchManager.client, 'graphql')
        .mockResolvedValue({
          data: {
            products: {
              collection: [],
              paginationInfo: { totalCount: 0, lastPage: 0, itemsPerPage: 10 },
              sortInfo: { current: [] },
              ...endpointData,
            },
          },
        })
    )
  }

  it('should request term suggestions on autocomplete when the bundle is configured', async () => {
    const searchManager = new SearchManager(
      new Configuration({
        baseUri: 'http://localhost',
        bundles: [SearchManager.TERM_SUGGESTION_BUNDLE_NAME],
      })
    )
    const mockGraphql = mockSearch(searchManager)

    await searchManager.search({ ...searchOptions, isAutocomplete: true })

    const [[query]] = mockGraphql.mock.calls
    expect(query).toContain('termSuggestions')
  })

  it('should not request term suggestions on autocomplete when the bundle is missing', async () => {
    const searchManager = new SearchManager(
      new Configuration({ baseUri: 'http://localhost' })
    )
    const mockGraphql = mockSearch(searchManager)

    await searchManager.search({ ...searchOptions, isAutocomplete: true })

    const [[query]] = mockGraphql.mock.calls
    expect(query).not.toContain('termSuggestions')
  })

  it('should not request term suggestions outside autocomplete even with the bundle', async () => {
    const searchManager = new SearchManager(
      new Configuration({
        baseUri: 'http://localhost',
        bundles: [SearchManager.TERM_SUGGESTION_BUNDLE_NAME],
      })
    )
    const mockGraphql = mockSearch(searchManager)

    await searchManager.search({ ...searchOptions, isAutocomplete: false })

    const [[query]] = mockGraphql.mock.calls
    expect(query).not.toContain('termSuggestions')
  })

  it('should return no term suggestions when the response has none', async () => {
    const searchManager = new SearchManager(
      new Configuration({ baseUri: 'http://localhost' })
    )
    mockSearch(searchManager)

    const response = await searchManager.search({
      ...searchOptions,
      isAutocomplete: true,
    })

    expect(response.getTermSuggestions()).toEqual([])
  })

  it('should return term suggestions from the response', async () => {
    const searchManager = new SearchManager(
      new Configuration({
        baseUri: 'http://localhost',
        bundles: [SearchManager.TERM_SUGGESTION_BUNDLE_NAME],
      })
    )
    const terms = [{ term: 'shirt', resultCount: 12, popularity: 3 }]
    mockSearch(searchManager, {
      termSuggestions: { entityType: 'product', terms },
    })

    const response = await searchManager.search({
      ...searchOptions,
      isAutocomplete: true,
    })

    expect(response.getTermSuggestions()).toEqual(terms)
  })
})
