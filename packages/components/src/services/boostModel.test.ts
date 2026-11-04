import {
  boostModels,
  getScaleFactorError,
  isBoostModelConfigJsonValid,
  isBoostModelConfigValid,
  isBoostModelFieldRequired,
} from './boostModel'

const attributeValueConfig = {
  source_field_code: 'price',
  boost_impact: 'sqrt',
  scale_factor: 1,
  allow_negative_boost: false,
}

const behavioralDataConfig = {
  data_type: { metric: 'views', timeframe: 'last_month', calculation: 'total' },
  boost_impact: 'log1p',
  scale_factor: 2,
  allow_negative_boost: true,
}

describe('Boost model service', () => {
  describe('isBoostModelFieldRequired', () => {
    it('Should tell which settings of a model are required', () => {
      expect(
        isBoostModelFieldRequired(boostModels.attributeValue, 'boost_impact')
      ).toEqual(true)
      expect(
        isBoostModelFieldRequired(
          boostModels.behavioralData,
          'data_type.metric'
        )
      ).toEqual(true)
      expect(
        isBoostModelFieldRequired(
          boostModels.attributeValue,
          'allow_negative_boost'
        )
      ).toEqual(false)
      expect(
        isBoostModelFieldRequired(boostModels.constantScore, 'boost_impact')
      ).toEqual(false)
      expect(
        isBoostModelFieldRequired('unknown_model', 'boost_impact')
      ).toEqual(false)
    })
  })

  describe('getScaleFactorError', () => {
    it('Should only accept a positive scale factor', () => {
      expect(getScaleFactorError(0.5)).toEqual('')
      expect(getScaleFactorError(0)).toEqual('scaleFactorWrongFormat')
      expect(getScaleFactorError(-1)).toEqual('scaleFactorWrongFormat')
    })
  })

  describe('isBoostModelConfigValid', () => {
    it('Should accept complete settings', () => {
      expect(
        isBoostModelConfigValid(
          boostModels.attributeValue,
          attributeValueConfig
        )
      ).toEqual(true)
      expect(
        isBoostModelConfigValid(
          boostModels.behavioralData,
          behavioralDataConfig
        )
      ).toEqual(true)
    })

    it('Should reject settings without a boost impact', () => {
      expect(
        isBoostModelConfigValid(boostModels.attributeValue, {
          ...attributeValueConfig,
          boost_impact: undefined,
        })
      ).toEqual(false)
      expect(
        isBoostModelConfigValid(boostModels.behavioralData, {
          ...behavioralDataConfig,
          boost_impact: '',
        })
      ).toEqual(false)
    })

    it('Should reject behavioral data without one of its dropdowns', () => {
      expect(
        isBoostModelConfigValid(boostModels.behavioralData, {
          ...behavioralDataConfig,
          data_type: { metric: 'views', timeframe: 'last_month' },
        })
      ).toEqual(false)
    })

    it('Should reject a scale factor of 0', () => {
      expect(
        isBoostModelConfigValid(boostModels.attributeValue, {
          ...attributeValueConfig,
          scale_factor: 0,
        })
      ).toEqual(false)
    })

    it('Should only accept a constant score within its range', () => {
      expect(isBoostModelConfigValid(boostModels.constantScore, 0)).toEqual(
        true
      )
      expect(isBoostModelConfigValid(boostModels.constantScore, -99)).toEqual(
        true
      )
      expect(isBoostModelConfigValid(boostModels.constantScore, 100)).toEqual(
        true
      )
      expect(isBoostModelConfigValid(boostModels.constantScore, 101)).toEqual(
        false
      )
      expect(
        isBoostModelConfigValid(boostModels.constantScore, undefined)
      ).toEqual(false)
    })

    it('Should reject a model without rules and report it in the console', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      expect(isBoostModelConfigValid('unknown_model', {})).toEqual(false)
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('"unknown_model"')
      )
      consoleError.mockRestore()
    })
  })

  describe('isBoostModelConfigJsonValid', () => {
    it('Should validate the model part of the modelConfig JSON', () => {
      expect(
        isBoostModelConfigJsonValid(
          boostModels.attributeValue,
          JSON.stringify({
            attribute_value_config: attributeValueConfig,
            behavioral_data_value: {},
          })
        )
      ).toEqual(true)
      expect(
        isBoostModelConfigJsonValid(
          boostModels.behavioralData,
          JSON.stringify({ attribute_value_config: attributeValueConfig })
        )
      ).toEqual(false)
    })

    it('Should reject missing or broken JSON', () => {
      expect(
        isBoostModelConfigJsonValid(boostModels.attributeValue, undefined)
      ).toEqual(false)
      expect(
        isBoostModelConfigJsonValid(boostModels.attributeValue, '{broken')
      ).toEqual(false)
    })

    it('Should read the constant score from its key', () => {
      expect(
        isBoostModelConfigJsonValid(
          boostModels.constantScore,
          JSON.stringify({ constant_score_value: 10 })
        )
      ).toEqual(true)
      expect(
        isBoostModelConfigJsonValid(
          boostModels.constantScore,
          JSON.stringify({ constant_score_value: -100 })
        )
      ).toEqual(false)
    })

    it('Should reject a model without rules whatever its JSON', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      expect(
        isBoostModelConfigJsonValid('unknown_model', JSON.stringify({}))
      ).toEqual(false)
      expect(consoleError).toHaveBeenCalledTimes(1)
      consoleError.mockRestore()
    })
  })
})
