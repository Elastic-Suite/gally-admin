import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UploadJobFileModal from './UploadJobFileModal'
import { IJobProfileInfos } from '@elastic-suite/gally-admin-shared'
import { renderWithProviders } from '../../../utils/tests'
import { TestId, generateTestId } from '../../../utils/testIds'
import { enqueueSnackbar } from 'notistack'

// Mock only resource operations
const mockCreateJobFile = jest.fn()
const mockCreateJob = jest.fn()

jest.mock('../../../hooks', () => {
  const { useResource, ...restOfTheHooks } =
    jest.requireActual('../../../hooks')
  return {
    ...restOfTheHooks,
    // We call useResourceOperations and useResource with different resources in the components
    // We must be able to differentiate them but the generic mock return only an undescriptive object
    useResource: jest.fn((resourceName) => {
      if (resourceName === 'JobFile' || resourceName === 'Job') {
        return { label: resourceName }
      }
      return useResource(resourceName)
    }),
    useResourceOperations: jest.fn((resource) => {
      if (resource?.label === 'JobFile') {
        return { create: mockCreateJobFile }
      }
      if (resource?.label === 'Job') {
        return { create: mockCreateJob }
      }
      return {}
    }),
  }
})

// Mock FileUploadDropzone
let mockOnFileUpload: ((file: File) => Promise<void>) | null = null

jest.mock('../FileUploadDropzone/FileUploadDropzone', () => ({
  __esModule: true,
  default: ({ onFileUpload }: any): JSX.Element => {
    mockOnFileUpload = onFileUpload
    return (
      <div data-testid={generateTestId(TestId.FILE_UPLOAD_DROPZONE)}>
        <button
          data-testid="mock-upload-trigger"
          onClick={async (): Promise<void> => {
            const file = new File(['test content'], 'test.csv', {
              type: 'text/csv',
            })
            await onFileUpload(file)
          }}
          type="button"
        >
          Upload File
        </button>
      </div>
    )
  },
}))

describe('UploadJobFileModal', () => {
  const mockOnClose = jest.fn()
  const mockOnFileUploaded = jest.fn()

  const mockProfile: IJobProfileInfos = {
    label: 'Test Import Profile',
    profile: 'TEST_IMPORT',
  }

  const defaultProps = {
    isOpen: true,
    profile: mockProfile,
    onClose: mockOnClose,
    onFileUploaded: mockOnFileUploaded,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnFileUpload = null
  })

  it('should render correctly when open with profile', () => {
    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const modal = screen.getByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL)
    )
    const title = screen.getByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL_TITLE)
    )

    expect(modal).toBeInTheDocument()
    expect(title).toHaveTextContent('Test Import Profile')
  })

  it('should not render when isOpen is false', () => {
    renderWithProviders(<UploadJobFileModal {...defaultProps} isOpen={false} />)

    const modal = screen.queryByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL)
    )

    expect(modal).toEqual(null)
  })

  it('should display profile label in title', () => {
    const customProfile: IJobProfileInfos = {
      label: 'Custom Profile Label',
      profile: 'CUSTOM_PROFILE',
    }

    renderWithProviders(
      <UploadJobFileModal {...defaultProps} profile={customProfile} />
    )

    const title = screen.getByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL_TITLE)
    )

    expect(title).toHaveTextContent('Custom Profile Label')
  })

  it('should call onClose when close button is clicked', () => {
    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    userEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle successful file upload', async () => {
    mockCreateJobFile.mockResolvedValue({ '@id': '/job_files/1' })
    mockCreateJob.mockResolvedValue({ id: 1 })

    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(mockCreateJobFile).toHaveBeenCalledWith(expect.any(FormData))
    })

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalledWith({
        type: 'import',
        profile: 'TEST_IMPORT',
        file: '/job_files/1',
      })
    })

    expect(mockOnFileUploaded).toHaveBeenCalledTimes(1)
  })

  it('should handle job file creation error', async () => {
    mockCreateJobFile.mockResolvedValue({
      error: true,
      message: 'File upload failed',
    })

    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variant: 'error' })
      )
    })

    expect(mockCreateJob).not.toHaveBeenCalled()
    expect(mockOnFileUploaded).not.toHaveBeenCalled()
  })

  it('should handle job creation error', async () => {
    mockCreateJobFile.mockResolvedValue({ '@id': '/job_files/1' })
    mockCreateJob.mockResolvedValue({
      error: true,
      message: 'Job creation failed',
    })

    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variant: 'error' })
      )
    })

    expect(mockOnFileUploaded).not.toHaveBeenCalled()
  })

  it('should show success message on successful upload', async () => {
    mockCreateJobFile.mockResolvedValue({ '@id': '/job_files/1' })
    mockCreateJob.mockResolvedValue({ id: 1 })

    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variant: 'success' })
      )
    })
  })

  it('should create FormData with correct file', async () => {
    mockCreateJobFile.mockResolvedValue({ '@id': '/job_files/1' })
    mockCreateJob.mockResolvedValue({ id: 1 })

    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(mockCreateJobFile).toHaveBeenCalled()
    })

    const [[formData]] = mockCreateJobFile.mock.calls
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('file')).toBeInstanceOf(File)
  })

  it('should use correct profile code in job creation', async () => {
    const customProfile: IJobProfileInfos = {
      label: 'Custom Profile',
      profile: 'CUSTOM_CODE',
    }
    mockCreateJobFile.mockResolvedValue({ '@id': '/job_files/1' })
    mockCreateJob.mockResolvedValue({ id: 1 })

    renderWithProviders(
      <UploadJobFileModal {...defaultProps} profile={customProfile} />
    )

    const uploadTrigger = screen.getByTestId('mock-upload-trigger')
    userEvent.click(uploadTrigger)

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: 'CUSTOM_CODE',
        })
      )
    })
  })

  it('should pass correct props to FileUploadDropzone', () => {
    renderWithProviders(<UploadJobFileModal {...defaultProps} />)

    expect(mockOnFileUpload).toBeDefined()
    expect(typeof mockOnFileUpload).toBe('function')
  })
})
