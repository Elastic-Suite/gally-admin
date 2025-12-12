import React, { useEffect, useMemo, useState } from 'react'
import {
  IConfigurations,
  IExplainVariables,
  IGraphqlSearchExplainProducts,
  ITableRow,
  ImageIcon,
  LoadStatus,
  cleanExplainGraphQLVariables,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getIdFromIri,
  getSearchExplainProductsQuery,
  productTableheader,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../hooks'
import FieldGuesser from '../FieldGuesser/FieldGuesser'
import PagerTable from '../../organisms/PagerTable/PagerTable'
import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import { useTranslation } from 'next-i18next'
import ExplainQueryDetails from '../../molecules/Explain/ExplainQueryDetails'
import ExplainDetails from '../../molecules/Explain/ExplainDetails'

interface IProps {
  variables: IExplainVariables
  configuration: IConfigurations
  limitationType: string
  onProductsLoaded?: (nbResults: number, nbTopProducts: number) => void
}

function ProductsPreviewBottom(props: IProps): JSX.Element {
  const { variables, configuration, limitationType, onProductsLoaded } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const { t } = useTranslation('categories')

  const variablesFormatted = useMemo(() => {
    const cleanedVariables = cleanExplainGraphQLVariables(
      variables,
      limitationType
    )
    return {
      requestType: cleanedVariables.requestType,
      localizedCatalog: getIdFromIri(String(cleanedVariables.localizedCatalog)),
      currentCategoryId: cleanedVariables?.category?.id,
      search: cleanedVariables?.search,
      currentPage,
      pageSize: rowsPerPage,
    }
  }, [variables, currentPage, rowsPerPage, limitationType])

  const [explain] = useGraphqlApi<IGraphqlSearchExplainProducts>(
    getSearchExplainProductsQuery(),
    variablesFormatted
  )

  const positions = explain?.data?.explain?.explainData?.extraData
    ?.positions as Record<string, number | string>[]

  const tableRows = (explain?.data?.explain?.collection
    ? explain?.data?.explain?.collection.map((explainProduct) => {
        return {
          ...explainProduct,
          score: {
            scoreValue: explainProduct.score,
            boostInfos: {
              type:
                explainProduct.boosts?.weight &&
                explainProduct.boosts?.weight !== 1
                  ? (explainProduct.boosts?.weight as number) > 1
                    ? 'up'
                    : 'down'
                  : '',
              boostNumber: explainProduct.boosts?.total,
              boostMultiplicator: explainProduct.boosts?.weight,
            },
          },
          image: {
            path: explainProduct.image,
            icons: positions?.some(
              (position) =>
                String(position.productId) === getIdFromIri(explainProduct.id)
            )
              ? [ImageIcon.PIN]
              : [],
          },
          popIn: {
            children: (
              <ExplainDetails
                explainProduct={explainProduct}
                localizedCatalogId={variablesFormatted.localizedCatalog}
              />
            ),
            styles: { paper: { minWidth: '835px' } },
          },
        }
      })
    : []) as unknown as ITableRow[]

  useEffect(() => {
    if (
      typeof onProductsLoaded === 'function' &&
      explain.status === LoadStatus.SUCCEEDED
    ) {
      const positions = explain.data.explain.explainData.extraData?.positions
      onProductsLoaded(
        explain.data.explain.paginationInfo.totalCount,
        positions instanceof Array ? positions.length : 0
      )
    }
  }, [explain, onProductsLoaded])

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  function onPageChange(page: number): void {
    setCurrentPage(page + 1)
  }

  return (
    <>
      {tableRows.length > 0 ? (
        <>
          <PagerTable
            Field={FieldGuesser}
            count={explain.data.explain.paginationInfo.totalCount}
            currentPage={
              (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
            }
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={defaultRowsPerPageOptions ?? []}
            tableHeaders={productTableheader}
            tableRows={tableRows}
            configuration={configuration}
            hoverableLine
            componentId="productsPreviewBottom"
          />
          <ExplainQueryDetails
            index={explain.data.explain.explainData.elasticSearchQuery.index}
            query={JSON.parse(
              explain.data.explain.explainData.elasticSearchQuery.query
            )}
            boxStyle={{
              position: 'fixed',
              bottom: '5%',
              right: '2%',
              zIndex: 4,
            }}
          />
        </>
      ) : (
        <NoAttributes title={t('noProductSearch')} />
      )}
    </>
  )
}

export default ProductsPreviewBottom
