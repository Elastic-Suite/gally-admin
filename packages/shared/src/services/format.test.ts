import {
  addPrefixKeyObject,
  createUTCDateSafe,
  firstLetterLowercase,
  firstLetterUppercase,
  formatPrice,
  getFieldLabelTranslationArgs,
  getHeadTitle,
  getIdFromIri,
  getIri,
  getNameFromDefault,
  humanize,
  joinUrlPath,
  roundNumber,
} from './format'
import { defaultApiRootPrefix } from '../constants'

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

  describe('joinUrlPath', () => {
    it('Should create an url from parts passed in arguments', () => {
      expect(joinUrlPath('base_url', 'media_catalog')).toEqual(
        'base_url/media_catalog'
      )
      expect(joinUrlPath('base_url', null)).toEqual('base_url/')
      expect(joinUrlPath('base_url', null, 'media_catalog')).toEqual(
        'base_url//media_catalog'
      )
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
      expect(getIri('localized_catalog', 1)).toEqual(
        `/${defaultApiRootPrefix}/localized_catalog/1`
      )
      expect(getIri('localized_catalog', '1')).toEqual(
        `/${defaultApiRootPrefix}/localized_catalog/1`
      )
      expect(getIri('/localized_catalog/', '1')).toEqual(
        `/${defaultApiRootPrefix}/localized_catalog/1`
      )
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

  describe('createUTCDateSafe', () => {
    // BEWARE: using a function Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    // Would interpret 0002 as 1902 and prevent inputting a four digit date using the keyboard
    it('should keep 2 digit year and not consider it is 19xx', () => {
      const twoDigitsYearDate = new Date('0002-01-01T00:00:00')
      expect(createUTCDateSafe(twoDigitsYearDate).toISOString()).toContain(
        '0002-01-01T00:00:00.000Z'
      )
    })

    it('does not rollback date to the previous day in edge cases', () => {
      // Depending on GMT+0200 a date to midnight could be interpreted as the previous day, depending on the formatting function used
      // for example, using toISOString would subtract 2 hours and make this date the 18th of October
      const dateCloseToPreviousDay = new Date(
        Date.parse('Sat Oct 19 2030 00:00:00')
      )
      expect(createUTCDateSafe(dateCloseToPreviousDay).toISOString()).toContain(
        '2030-10-19T00:00:00.000Z'
      )
    })
  })
})
