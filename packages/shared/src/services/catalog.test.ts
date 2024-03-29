import { IHydraCatalog } from '../types'

import {
  getDefaultCatalog,
  getLocalizedCatalog,
  getLocalizedCatalogFromCatalogs,
} from './catalog'

const defaultCatalog = {
  '@type': 'test',
  '@id': 'test',
  id: 11,
  name: 'test11',
  code: 'test11',
  currency: 'EUR',
  locale: 'test',
  isDefault: true,
  localName: 'test11',
}

const defaultCatalog2 = {
  '@type': 'test2',
  '@id': 'test2',
  id: 12,
  name: 'test12',
  code: 'test12',
  currency: 'EUR',
  locale: 'test2',
  isDefault: true,
  localName: 'test12',
}

const mockCatalogs: IHydraCatalog[] = [
  {
    '@type': 'test',
    '@id': 'test',
    id: 1,
    code: 'test',
    name: 'test',
    localizedCatalogs: [
      defaultCatalog,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
  {
    '@type': 'test',
    '@id': 'test',
    id: 2,
    code: 'test2',
    name: 'test2',
    localizedCatalogs: [
      {
        '@type': 'test',
        '@id': 'test',
        id: 14,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
      {
        '@type': 'test',
        '@id': 'test',
        id: 15,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
]

const mockCatalogsWithTwoDefault: IHydraCatalog[] = [
  {
    '@type': 'test',
    '@id': 'test',
    id: 1,
    code: 'test',
    name: 'test',
    localizedCatalogs: [
      defaultCatalog,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
  {
    '@type': 'test',
    '@id': 'test',
    id: 2,
    code: 'test2',
    name: 'test2',
    localizedCatalogs: [
      defaultCatalog2,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
]

describe('Catalog service', () => {
  describe('getDefaultCatalog', () => {
    it('should return default catalog', () => {
      expect(getDefaultCatalog(mockCatalogs)).toEqual({
        '@type': 'test',
        '@id': 'test',
        id: 1,
        code: 'test',
        name: 'test',
        localizedCatalogs: [defaultCatalog],
      })
    })
    it('should return first default catalogs in case of several default catalogs are present', () => {
      expect(getDefaultCatalog(mockCatalogsWithTwoDefault)).toEqual({
        '@type': 'test',
        '@id': 'test',
        id: 1,
        code: 'test',
        name: 'test',
        localizedCatalogs: [defaultCatalog],
      })
    })
  })

  describe('getLocalizedCatalog', () => {
    it('should find default catalog if All catalogs selected', () => {
      expect(getLocalizedCatalog(mockCatalogs)).toEqual(defaultCatalog)
    })
    it('should find first localized catalog if no loacl selected', () => {
      expect(getLocalizedCatalog(mockCatalogs, mockCatalogs[1], null)).toEqual({
        '@type': 'test',
        '@id': 'test',
        id: 14,
        name: 'test11',
        code: 'test11',
        currency: 'EUR',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      })
    })
  })

  describe('getLocalizedCatalogFromCatalogs', () => {
    it('should find localized catalog with id "11"', () => {
      expect(getLocalizedCatalogFromCatalogs(mockCatalogs, 11)).toEqual(
        defaultCatalog
      )
    })
    it('should not find localized catalog with id "fake_id"', () => {
      expect(getLocalizedCatalogFromCatalogs(mockCatalogs, 'fake_id')).toEqual(
        undefined
      )
    })
  })
})
