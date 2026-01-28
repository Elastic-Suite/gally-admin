import React from 'react'
import { Screen, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUploadDropzone from './FileUploadDropzone'
import { renderWithProviders } from '../../../utils/tests'
import { TestId, generateTestId } from '../../../utils/testIds'

function getHiddenFileInput(screen: Screen): HTMLInputElement {
  return screen.getByTestId(
    generateTestId(TestId.FILE_UPLOAD_DROPZONE, 'input')
  ) as HTMLInputElement
}

describe('FileUploadDropzone', () => {
  const mockOnFileUpload = jest.fn()

  const defaultProps = {
    onFileUpload: mockOnFileUpload,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly with default props', () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const dropzone = screen.getByTestId(
      generateTestId(TestId.FILE_UPLOAD_DROPZONE)
    )
    expect(dropzone).toBeInTheDocument()
    expect(screen.getByText(/upload.dragAndDrop/i)).toBeInTheDocument()
    expect(screen.getByText(/upload.orClickToBrowse/i)).toBeInTheDocument()
  })

  it('should show info section when showInfo is true', () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} showInfo />)

    expect(screen.getByText(/upload.acceptedFileTypes/i)).toBeInTheDocument()
    expect(screen.getByText(/upload.maximumFileSize/i)).toBeInTheDocument()
  })

  it('should hide info section when showInfo is false', () => {
    renderWithProviders(
      <FileUploadDropzone {...defaultProps} showInfo={false} />
    )

    expect(
      screen.queryByText(/upload.acceptedFileTypes/i)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/upload.maximumFileSize/i)
    ).not.toBeInTheDocument()
  })

  it('should handle file selection via input', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })
  })

  it('should display selected file name and size', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test content'], 'document.pdf', {
      type: 'application/pdf',
    })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/upload.fileSize/i)).toBeInTheDocument()
    })
  })

  it('should show upload button when file is selected', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    await waitFor(() => {
      const uploadButton = screen.getByTestId(
        generateTestId(TestId.BUTTON, 'upload')
      )
      expect(uploadButton).toBeInTheDocument()
    })
  })

  it('should call onFileUpload when upload button is clicked', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    const uploadButton = await screen.findByTestId(
      generateTestId(TestId.BUTTON, 'upload')
    )
    userEvent.click(uploadButton)

    expect(mockOnFileUpload).toHaveBeenCalledTimes(1)
    expect(mockOnFileUpload).toHaveBeenCalledWith(file)
  })

  it('should clear selected file after upload', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    const uploadButton = await screen.findByTestId(
      generateTestId(TestId.BUTTON, 'upload')
    )
    userEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.queryByText('test.txt')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/upload.dragAndDrop/i)).toBeInTheDocument()
    })
  })

  it('should validate file size', async () => {
    const maxFileSize = 1024 // 1KB
    renderWithProviders(
      <FileUploadDropzone {...defaultProps} maxFileSize={maxFileSize} />
    )

    const largeFile = new File(['x'.repeat(2048)], 'large.txt', {
      type: 'text/plain',
    })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, largeFile)

    await waitFor(() => {
      expect(
        screen.getByText(/upload.error.fileSizeExceeds/i)
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId(generateTestId(TestId.BUTTON, 'upload'))
    ).not.toBeInTheDocument()
  })

  it('should validate file type', async () => {
    renderWithProviders(
      <FileUploadDropzone {...defaultProps} acceptedFileTypes=".csv,.xlsx" />
    )

    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, invalidFile)

    await waitFor(() => {
      expect(
        screen.getByText(/upload.error.fileTypeNotAccepted/i)
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId(generateTestId(TestId.BUTTON, 'upload'))
    ).not.toBeInTheDocument()
  })

  it('should accept valid file type', async () => {
    renderWithProviders(
      <FileUploadDropzone {...defaultProps} acceptedFileTypes=".csv,.xlsx" />
    )

    const validFile = new File(['test'], 'test.csv', { type: 'text/csv' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, validFile)

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })

    expect(screen.queryByText(/upload.error/i)).not.toBeInTheDocument()
  })

  it('should handle drag and drop', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const innerDropzone = screen.getByTestId(
      generateTestId(TestId.FILE_UPLOAD_DROPZONE, 'dropzone')
    )
    const file = new File(['test'], 'dropped.txt', { type: 'text/plain' })

    fireEvent.dragEnter(innerDropzone, {
      dataTransfer: { files: [file] },
    })

    fireEvent.drop(innerDropzone, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText('dropped.txt')).toBeInTheDocument()
    })
  })

  it('should open file dialog when dropzone is clicked', () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const innerDropzone = screen.getByTestId(
      generateTestId(TestId.FILE_UPLOAD_DROPZONE, 'dropzone')
    )
    const input = getHiddenFileInput(screen)
    const clickSpy = jest.spyOn(input, 'click')

    userEvent.click(innerDropzone)

    expect(clickSpy).toHaveBeenCalled()
  })

  it('should display file size in MB', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['x'.repeat(1048576)], 'large.txt', {
      type: 'text/plain',
    })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    await waitFor(() => {
      const sizeText = screen.getByText(/upload.fileSize/i)
      expect(sizeText).toBeInTheDocument()
    })
  })

  it('should show change file message when file is selected', async () => {
    renderWithProviders(<FileUploadDropzone {...defaultProps} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = getHiddenFileInput(screen)

    userEvent.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText(/upload.clickToChange/i)).toBeInTheDocument()
    })
  })
})
