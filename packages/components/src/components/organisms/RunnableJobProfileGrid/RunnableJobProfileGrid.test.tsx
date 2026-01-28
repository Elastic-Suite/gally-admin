import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RunnableJobProfileGrid from './RunnableJobProfileGrid'
import {
  IJobProfileInfos,
  IJobProfiles,
  ISearchParameters,
} from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../utils/testIds'
import { renderWithProviders } from '../../../utils/tests'

// Mock only ResourceTable component
jest.mock('../../stateful-pages/ResourceTable/ResourceTable', () => ({
  __esModule: true,
  default: (): null => null,
}))

// Mock only Trans component from next-i18next
jest.mock('next-i18next', () => {
  const original = jest.requireActual('next-i18next')
  return {
    ...original,
    Trans: ({ children, values }: any): JSX.Element => (
      <div data-testid="trans">{JSON.stringify([children, values])}</div>
    ),
  }
})

describe('RunnableJobProfileGrid', () => {
  const mockOnProfileRun = jest.fn()

  const defaultProps = {
    fixedFilters: {} as ISearchParameters,
    profiles: {
      profile1: { label: 'Profile 1', profile: 'PROFILE_1' },
      profile2: { label: 'Profile 2', profile: 'PROFILE_2' },
    } as IJobProfiles,
    defaultProfile: {
      label: 'Profile 1',
      profile: 'PROFILE_1',
    } as IJobProfileInfos,
    onProfileRun: mockOnProfileRun,
    pendingJobsCount: 0,
    componentId: 'test',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly with default props', () => {
    const { container } = renderWithProviders(
      <RunnableJobProfileGrid {...defaultProps} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display alert when pendingJobsCount is greater than 0', () => {
    renderWithProviders(
      <RunnableJobProfileGrid {...defaultProps} pendingJobsCount={5} />
    )

    const alert = screen.getByRole('alert')

    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('5')
  })

  it('should not display alert when pendingJobsCount is 0', () => {
    renderWithProviders(
      <RunnableJobProfileGrid {...defaultProps} pendingJobsCount={0} />
    )

    const alert = screen.queryByRole('alert')

    expect(alert).not.toBeInTheDocument()
  })

  it('should call onProfileRun when profile is run with the default profile', () => {
    renderWithProviders(<RunnableJobProfileGrid {...defaultProps} />)

    const runButton = screen.getByTestId(
      generateTestId(TestId.IMPORT_EXPORT_PROFILE_RUN, defaultProps.componentId)
    )
    userEvent.click(runButton)
    expect(mockOnProfileRun).toHaveBeenCalledWith(defaultProps.defaultProfile)
  })

  it('should hide alert when close button is clicked', async () => {
    renderWithProviders(
      <RunnableJobProfileGrid {...defaultProps} pendingJobsCount={5} />
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    userEvent.click(closeButton)

    await waitFor(() => {
      const alertAfterClose = screen.queryByRole('alert')
      expect(alertAfterClose).not.toBeInTheDocument()
    })
  })

  it('should keep alert hidden after closing even when pendingJobsCount changes', async () => {
    const { rerender } = renderWithProviders(
      <RunnableJobProfileGrid {...defaultProps} pendingJobsCount={5} />
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    userEvent.click(closeButton)

    await waitFor(() => {
      const alertAfterClose = screen.queryByRole('alert')
      expect(alertAfterClose).not.toBeInTheDocument()
    })

    rerender(<RunnableJobProfileGrid {...defaultProps} pendingJobsCount={10} />)

    const alertAfterRerender = screen.queryByRole('alert')
    expect(alertAfterRerender).not.toBeInTheDocument()
  })
})
