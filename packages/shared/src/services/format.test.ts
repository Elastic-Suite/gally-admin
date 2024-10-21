import {
  addPrefixKeyObject,
  firstLetterLowercase,
  firstLetterUppercase,
  formatPrice,
  getFieldLabelTranslationArgs,
  getHeadTitle,
  getIdFromIri,
  getIri,
  getNameFromDefault,
  humanize,
  roundNumber,
} from './format'

describe('Format service', () => {
  describe('firstLetterUppercase', () => {
    it('Should set first letter to uppercase', () => {
      expect(firstLetterUppercase('hello there')).toEqual('Hello there')
    })
  })

  describe('firstLetterLowercase', () => {
    it('Should set first letter to lowercase', () => {
      expect(firstLetterLowercase('Hello there')).toEqual('hello there')
    })
  })

  describe('getNameFromDefault', () => {
    it('Should get the name without the default part', () => {
      expect(getNameFromDefault('defaultMaxSize')).toEqual('maxSize')
    })
  })

  describe('humanize', () => {
    it('Should humanize the label', () => {
      expect(humanize('defaultLabel')).toEqual('Default label')
    })
  })

  describe('getHeadTitle', () => {
    it('Should add Gally at the end of string getHeadTitle', () => {
      expect(getHeadTitle('Catégories')).toEqual('Catégories - Gally')
    })
  })

  describe('getFieldLabelTranslationArgs', () => {
    it('Should return field label (args for translation)', () => {
      expect(getFieldLabelTranslationArgs('defaultLabel')).toEqual([
        'fields.defaultLabel',
        'Default label',
      ])
      expect(getFieldLabelTranslationArgs('defaultLabel', 'metadata')).toEqual([
        'resources.metadata.fields.defaultLabel',
        'Default label',
      ])
    })
  })

  describe('addPrefixKeyObject', () => {
    it('Should add the prefix "category", on all keys of the object', () => {
      expect(
        addPrefixKeyObject(
          { localizedCatalog: 'com_fr', search: 'bag' },
          'category'
        )
      ).toEqual({ categoryLocalizedCatalog: 'com_fr', categorySearch: 'bag' })
    })
  })

  describe('formatPrice', () => {
    it('Should format price', () => {
      expect(formatPrice(100, 'USD', 'fr-FR')).toContain('100,00')
      expect(formatPrice(100, 'USD', 'fr-FR')).toContain('$US')
    })
  })

  describe('getIdFromIri', () => {
    it('Should get the id from the iri', () => {
      expect(getIdFromIri('/localized_catalog/1')).toEqual('1')
      expect(getIdFromIri('/localized_catalog/random/10')).toEqual('10')
    })
  })

  describe('getIri', () => {
    it('Should get iri', () => {
      expect(getIri('localized_catalog', 1)).toEqual('/localized_catalog/1')
      expect(getIri('localized_catalog', '1')).toEqual('/localized_catalog/1')
      expect(getIri('/localized_catalog/', '1')).toEqual('/localized_catalog/1')
    })
  })

  describe('roundNumber', () => {
    it('Should round the number to the decimal given', () => {
      expect(typeof roundNumber(1, 4)).toEqual('number')
      expect(roundNumber(1, 4)).toEqual(1)
      expect(roundNumber(1.005, 2)).toEqual(1.01)
      expect(roundNumber(1, 4, true)).toEqual('1.0000')
    })
  })
})
