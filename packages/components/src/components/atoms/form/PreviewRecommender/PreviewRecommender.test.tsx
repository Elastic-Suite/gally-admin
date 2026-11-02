import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  LoadStatus,
  RecommenderPreviewStatus,
  RecommenderProductOrigin,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../../hooks'
import { renderWithProviders } from '../../../../utils/tests'
import { TestId, generateTestId } from '../../../../utils/testIds'

import PreviewRecommender from './PreviewRecommender'

jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useGraphqlApi: jest.fn(),
}))

const recommender = {
  localizedCatalogs: ['/localized_catalogs/1'],
  recommenderTypes: ['/recommender_types/1'],
  similarityRule: '{}',
}

function mockPreview(
  status: RecommenderPreviewStatus,
  products: unknown[] = []
): void {
  ;(useGraphqlApi as jest.Mock).mockReturnValue([
    {
      status: LoadStatus.SUCCEEDED,
      data: { getRecommenderPreview: { status, products } },
    },
  ])
}

async function previewSourceProduct(sku: string): Promise<void> {
  await userEvent.click(await screen.findByRole('combobox'))
  await userEvent.click(
    await screen.findByRole('option', { name: 'COM French Catalog' })
  )
  await userEvent.type(screen.getByRole('textbox'), sku)
  const submitButton = screen.getByRole('button', { name: 'preview.submit' })
  // The dropdown passes its value asynchronously
  await waitFor(() => expect(submitButton).toBeEnabled())
  await userEvent.click(submitButton)
}

describe('PreviewRecommender', () => {
  beforeEach(() => {
    ;(useGraphqlApi as jest.Mock).mockReset()
    mockPreview(RecommenderPreviewStatus.OK)
  })

  it('asks for the localized catalogs and recommender types', () => {
    renderWithProviders(<PreviewRecommender currentRecommender={{}} />)
    expect(
      screen.getByTestId(generateTestId(TestId.PREVIEW_REQUIRED_MESSAGE))
    ).toBeInTheDocument()
  })

  it('previews the submitted source product only', async () => {
    renderWithProviders(<PreviewRecommender currentRecommender={recommender} />)
    expect(useGraphqlApi).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ productSku: '' }),
      undefined,
      false
    )
    expect(screen.getByText('preview.noSourceProduct')).toBeInTheDocument()

    await previewSourceProduct('24-MB01')

    expect(useGraphqlApi).toHaveBeenLastCalledWith(
      expect.any(String),
      {
        localizedCatalog: '1',
        productSku: '24-MB01',
        currentRecommender: JSON.stringify(recommender),
      },
      undefined,
      true
    )
  })

  it('displays the recommended products with their origin', async () => {
    mockPreview(RecommenderPreviewStatus.OK, [
      {
        id: 1,
        sku: '24-MB02',
        name: 'Bag',
        origin: RecommenderProductOrigin.CO_OCCURRENCE,
      },
      {
        id: 2,
        sku: '24-WB01',
        name: 'Watch',
        origin: RecommenderProductOrigin.RULE,
      },
    ])
    renderWithProviders(<PreviewRecommender currentRecommender={recommender} />)
    await previewSourceProduct('24-MB01')

    expect(await screen.findByText('24-MB02')).toBeInTheDocument()
    expect(screen.getByText('preview.origin.co_occurrence')).toBeInTheDocument()
    expect(screen.getByText('24-WB01')).toBeInTheDocument()
    expect(screen.getByText('preview.origin.rule')).toBeInTheDocument()
  })

  it('explains why there is no recommendation', async () => {
    mockPreview(RecommenderPreviewStatus.NOT_APPLICABLE)
    renderWithProviders(<PreviewRecommender currentRecommender={recommender} />)
    await previewSourceProduct('24-MB01')

    expect(
      await screen.findByText('preview.status.not_applicable')
    ).toBeInTheDocument()
  })
})
