import {
  fieldBoolean,
  fieldDropdown,
  fieldDropdownWithApiOptions,
  fieldDropdownWithContext,
  fieldWithContextAndMainContext,
} from '../mocks'

import {
  IMainContext,
  getFieldState,
  hasFieldOptions,
  isDropdownStaticOptions,
  updatePropertiesAccordingToPath,
} from './field'

describe('Field service', () => {
  describe('updatePropertiesAccordingToPath', () => {
    it('Should update properties with context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'admin/settings/attributes',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        gally: {
          ...fieldDropdownWithContext.gally,
          editable: false,
          position: 20,
          visible: true,
        },
      })
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'search/configuration/attribute',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        gally: {
          ...fieldDropdownWithContext.gally,
          editable: false,
          position: 30,
          visible: false,
        },
      })
    })

    it('Should update properties with context and not MainContext', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldWithContextAndMainContext,
          'search/configuration/attributes',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldWithContextAndMainContext,
        gally: {
          ...fieldWithContextAndMainContext.gally,
          editable: true,
          position: 60,
          visible: true,
        },
      })
    })

    it('Should update mulitple properties with MainContext', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldWithContextAndMainContext,
          '',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldWithContextAndMainContext,
        gally: {
          ...fieldWithContextAndMainContext.gally,
          editable: true,
          position: 60,
          visible: false,
        },
      })
    })

    it('Should update properties without context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdown,
          'admin/settings/attributes',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldDropdown,
        gally: {
          ...fieldDropdown.gally,
          editable: false,
          position: 10,
          visible: true,
        },
      })
    })

    it('Should update properties with useless context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'test/useless',
          IMainContext.FORM
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        gally: {
          ...fieldDropdownWithContext.gally,
          editable: false,
          position: 10,
          visible: true,
        },
      })
    })
  })

  describe('hasFieldOptions', () => {
    it('should check if field has options (defined in schema)', () => {
      expect(hasFieldOptions(fieldBoolean)).toEqual(false)
      expect(hasFieldOptions(fieldDropdown)).toEqual(true)
    })
  })

  describe('isDropdownStaticOptions', () => {
    it('should check if field schema options are static or not', () => {
      expect(isDropdownStaticOptions(fieldDropdown.gally.options)).toEqual(true)
      expect(
        isDropdownStaticOptions(fieldDropdownWithApiOptions.gally.options)
      ).toEqual(false)
    })
  })

  describe('getFieldState', () => {
    it('get field state without conditions', () => {
      expect(getFieldState({ foo: 'bar' })).toEqual({})
    })

    it('get field state with conditions', () => {
      expect(
        getFieldState(
          { foo: 'bar', baz: true },
          { conditions: { field: 'baz', value: false }, type: 'enabled' }
        )
      ).toEqual({ disabled: true })
    })

    it('get field state with forced state', () => {
      expect(
        getFieldState({ foo: 'bar' }, undefined, { disabled: true })
      ).toEqual({ disabled: true })
      expect(
        getFieldState(
          { foo: 'bar', baz: true },
          { conditions: { field: 'baz', value: true }, type: 'enabled' },
          { disabled: false }
        )
      ).toEqual({ disabled: false })
    })
  })
})
