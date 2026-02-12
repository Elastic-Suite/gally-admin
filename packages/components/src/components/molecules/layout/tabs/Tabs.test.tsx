import React from 'react'

import { renderWithProviders } from '../../../../utils/tests'

import CustomTabs from './CustomTabs'
import { fireEvent, screen, waitFor } from '@testing-library/react'

describe('TabsAndSubTabs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <CustomTabs
        tabs={[
          {
            label: 'Tab 1',
            Component: (): JSX.Element => <>Hello World 1</>,
            id: 0,
          },
          {
            label: 'Tab 2',
            Component: (): JSX.Element => <>Hello World 2</>,
            id: 1,
          },
          {
            label: 'Tab 3',
            Component: (): JSX.Element => <>Hello World 3</>,
            id: 2,
          },
          {
            label: 'Tab 4',
            Component: (): JSX.Element => <>Hello World 4</>,
            id: 3,
          },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should not call onChange on initial mount', () => {
    const onChange = jest.fn()
    renderWithProviders(
      <CustomTabs
        defaultActiveId={0}
        tabs={[
          {
            id: 0,
            label: 'A',
            Component: (): JSX.Element => <>Hello World 1</>,
          },
          {
            id: 1,
            label: 'B',
            Component: (): JSX.Element => <>Hello World 2</>,
          },
        ]}
        onChange={onChange}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should call onChange only when tab changes', async () => {
    const onChange = jest.fn()
    renderWithProviders(
      <CustomTabs
        defaultActiveId={0}
        tabs={[
          {
            id: 0,
            label: 'A',
            Component: (): JSX.Element => <>Hello World 1</>,
          },
          {
            id: 1,
            label: 'B',
            Component: (): JSX.Element => <>Hello World 2</>,
          },
        ]}
        onChange={onChange}
      />
    )
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled()
    })
    fireEvent.click(screen.getAllByTestId('tab')[1])
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(1)
    })
  })
})
