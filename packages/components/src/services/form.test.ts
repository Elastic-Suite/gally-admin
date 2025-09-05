import { getFormValue, handleFormErrors, transformPropertyPath } from './form'
import { IError } from '@elastic-suite/gally-admin-shared'
import { enqueueSnackbar } from 'notistack'

describe('Form service', () => {
  describe('getFormValue', () => {
    it('Should get the form value with casting', () => {
      expect(getFormValue('42', { type: 'text' })).toEqual('42')
      expect(getFormValue('42', { type: 'number' })).toEqual(42)
      expect(getFormValue('', { type: 'text' })).toEqual('')
      expect(getFormValue('', { type: 'number' })).toEqual(null)
      expect(getFormValue('', { type: 'text', required: true })).toEqual('')
      expect(getFormValue('', { type: 'number', required: true })).toEqual(0)
    })
  })

  describe('transformPropertyPath', () => {
    it('Should return the correct value depending on parameter', () => {
      expect(transformPropertyPath('fromDate')).toEqual('doubleDatePicker')
      expect(transformPropertyPath('toDate')).toEqual('doubleDatePicker')
      expect(transformPropertyPath('somePropertyPath')).toEqual(
        'somePropertyPath'
      )
    })
  })

  describe('handleFormErrors', () => {
    // Mock notistack
    jest.mock('notistack', () => ({
      enqueueSnackbar: jest.fn(),
      closeSnackbar: jest.fn(),
    }))

    // Mock translation function
    const mockT = jest.fn((key: string) => {
      const translations: any = {
        'error.form': 'Form error occurred',
      }
      return translations[key] || key
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should handle field errors correctly', () => {
      const formErrors: IError = {
        violations: [
          { propertyPath: 'name', message: 'Name is required' },
          { propertyPath: 'email', message: 'Invalid email format' },
        ],
      }

      const result = handleFormErrors(formErrors, mockT)

      expect(result).toEqual({
        fields: {
          name: 'Name is required',
          email: 'Invalid email format',
        },
        global: [],
      })

      expect(enqueueSnackbar).toHaveBeenCalledWith('Form error occurred', {
        onShut: expect.any(Function),
        variant: 'error',
      })
    })

    it('should handle global errors correctly', () => {
      const formErrors: IError = {
        violations: [
          { message: 'Server error occurred' },
          { message: 'Internet connection failed' },
        ],
      }

      const result = handleFormErrors(formErrors, mockT)

      expect(result).toEqual({
        fields: {},
        global: ['Server error occurred', 'Internet connection failed'],
      })

      expect(enqueueSnackbar).toHaveBeenCalledTimes(2)
      expect(enqueueSnackbar).toHaveBeenNthCalledWith(
        1,
        'Form error occurred',
        {
          onShut: expect.any(Function),
          variant: 'error',
        }
      )
      expect(enqueueSnackbar).toHaveBeenNthCalledWith(
        2,
        'Server error occurred\nInternet connection failed',
        {
          onShut: expect.any(Function),
          variant: 'error',
          style: { whiteSpace: 'pre-line' },
          autoHideDuration: Infinity,
        }
      )
    })

    it('should handle mixed field and global errors', () => {
      const formErrors: IError = {
        violations: [
          { propertyPath: 'name', message: 'Name is required' },
          { message: 'Global error' },
          { propertyPath: 'fromDate', message: 'Invalid date' },
        ],
      }

      const result = handleFormErrors(formErrors, mockT)

      expect(result).toEqual({
        fields: {
          name: 'Name is required',
          doubleDatePicker: 'Invalid date', // fromDate gets transformed
        },
        global: ['Global error'],
      })
    })

    it('should transform property paths correctly', () => {
      const formErrors: IError = {
        violations: [
          { propertyPath: 'fromDate', message: 'From date error' },
          { propertyPath: 'toDate', message: 'To date error' },
          { propertyPath: 'regularField', message: 'Regular field error' },
        ],
      }

      const result = handleFormErrors(formErrors, mockT)

      expect(result.fields).toEqual({
        doubleDatePicker: 'To date error', // Last one wins for same transformed path
        regularField: 'Regular field error',
      })
    })
  })
})
