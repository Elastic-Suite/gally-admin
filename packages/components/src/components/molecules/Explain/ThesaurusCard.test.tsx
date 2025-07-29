import React from 'react'
import { renderWithProviders } from '../../../utils/tests'
import ThesaurusCard from './ThesaurusCard'
import Router from 'next/router'
import { fireEvent, screen } from '@testing-library/react'

const args = {
  button: {
    label: 'Modify Thesaurus',
    url: '/admin/search/thesaurus/grid',
  },
  terms: ['Top', 'Jacket', 'Tank'],
  title: 'Synonyms and expansions',
}

describe('ThesaurusCard', () => {
  it('Should match snapshot', () => {
    const { container } = renderWithProviders(<ThesaurusCard {...args} />)

    expect(container).toMatchSnapshot()
  })

  it('Should push to the correct URL when the button is clicked', () => {
    const pushSpy = Router.push as jest.Mock
    pushSpy.mockClear()
    renderWithProviders(<ThesaurusCard {...args} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(pushSpy).toHaveBeenCalledWith(args.button.url)
  })
})
