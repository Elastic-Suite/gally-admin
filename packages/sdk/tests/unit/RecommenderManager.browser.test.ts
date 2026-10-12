import { describe, expect, it, vi } from 'vitest'
import { RecommenderManager } from '../../src/service/RecommenderManager'
import { Configuration } from '../../src/client/Configuration'
import { Catalog } from '../../src/entity/Catalog'
import { LocalizedCatalog } from '../../src/entity/LocalizedCatalog'

describe('RecommenderManager', () => {
  const config = new Configuration({ baseUri: 'http://localhost' })

  function mockGraphql(
    manager: RecommenderManager,
    response: Record<string, unknown> = { data: { productRecommendations: [] } }
  ) {
    return (
      vi
        // @ts-expect-error we spy on an object here so property is accessible
        .spyOn(manager.client, 'graphql')
        .mockResolvedValue(response)
    )
  }

  it('should not call the API when no SKU is given', async () => {
    const manager = new RecommenderManager(config)
    const graphql = mockGraphql(manager)

    const result = await manager.getProductRecommendations(
      'cross-sell',
      'com_en',
      ['', '']
    )

    expect(result).toEqual([])
    expect(graphql).not.toHaveBeenCalled()
  })

  it('should send unique SKUs as a public query', async () => {
    const manager = new RecommenderManager(config)
    const graphql = mockGraphql(manager)

    await manager.getProductRecommendations('upsell', 'com_en', [
      'sku1',
      'sku2',
      'sku1',
    ])

    const [[query, variables, headers, isPrivate]] = graphql.mock.calls
    expect(query).toContain('productRecommendations')
    expect(variables).toEqual({
      recommendationType: 'upsell',
      localizedCatalog: 'com_en',
      productSkus: ['sku1', 'sku2'],
    })
    expect(headers).toEqual({})
    expect(isPrivate).toBe(false)
  })

  it('should send productCount and the localized catalog code', async () => {
    const manager = new RecommenderManager(config)
    const graphql = mockGraphql(manager)
    const localizedCatalog = new LocalizedCatalog(
      new Catalog('com', 'Com'),
      'com_fr',
      'French',
      'fr_FR',
      'EUR'
    )

    await manager.getProductRecommendations(
      'cross-sell',
      localizedCatalog,
      ['sku1'],
      4
    )

    const [[, variables]] = graphql.mock.calls
    expect(variables.localizedCatalog).toBe('com_fr')
    expect(variables.productCount).toBe(4)
  })

  it('should always select sku, once', async () => {
    const manager = new RecommenderManager(config)
    const graphql = mockGraphql(manager)

    await manager.getProductRecommendations(
      'cross-sell',
      'com_en',
      ['sku1'],
      undefined,
      ['sku', 'name', 'price { price }']
    )

    const [[query]] = graphql.mock.calls
    expect(query.match(/\bsku\b/g)).toHaveLength(1)
    expect(query).toContain('sku name price { price }')
  })

  it('should return the products, or an empty list without data', async () => {
    const products = [{ sku: 'sku2' }, { sku: 'sku3' }]
    const manager = new RecommenderManager(config)
    mockGraphql(manager, { data: { productRecommendations: products } })
    expect(
      await manager.getProductRecommendations('upsell', 'com_en', ['sku1'])
    ).toEqual(products)

    const emptyManager = new RecommenderManager(config)
    mockGraphql(emptyManager, {})
    expect(
      await emptyManager.getProductRecommendations('upsell', 'com_en', ['sku1'])
    ).toEqual([])
  })
})
