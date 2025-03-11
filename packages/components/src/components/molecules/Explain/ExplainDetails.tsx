import React, { CSSProperties, ReactNode, useContext, useState } from 'react'
import {
  IGraphqlExplainProduct,
  formatPrice,
  getLocalizedCatalogFromCatalogs,
  getStockStatusLabel,
  roundNumber,
} from '@elastic-suite/gally-admin-shared'

import { IRow } from '../../atoms/ReadOnlyTable/ReadOnlyTable.styled'
import ReadOnlyTable from '../../atoms/ReadOnlyTable/ReadOnlyTable'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import PopIn from '../../atoms/modals/PopIn'
import { AnalyzerLegends, ExplainDetailsStyled } from './ExplainDetails.styled'
import { useTranslation } from 'next-i18next'
import { selectLanguage, useAppSelector } from '../../../store'
import { catalogContext } from '../../../contexts'
import { Collapse } from '@mui/material'

interface IProps {
  explainProduct: IGraphqlExplainProduct
  localizedCatalogId: string | number
}

function ExplainDetails(props: IProps): JSX.Element {
  const { explainProduct, localizedCatalogId } = props

  const [open, setOpen] = useState(false)
  const { catalogs } = useContext(catalogContext)
  const language = useAppSelector(selectLanguage)
  const { t } = useTranslation(['explain', 'common'])

  const localizedCatalog = getLocalizedCatalogFromCatalogs(
    catalogs,
    localizedCatalogId
  )
  const currency = localizedCatalog ? localizedCatalog.currency : 'EUR'

  const header: IRow = {
    cells: [
      {
        id: 'field',
        value: t('Field'),
        style: {
          width: '344px',
        },
      },
      {
        id: 'term',
        value: t('Term'),
        style: {
          width: '200px',
        },
      },
      {
        id: 'Weight',
        value: t('Weight'),
        style: {
          width: '87px',
          textAlign: 'right',
        },
      },
      {
        id: 'score',
        value: t('Score'),
        style: {
          width: '107px',
          textAlign: 'right',
        },
      },
    ],
  }

  function getMatchTableRow(
    match: Record<string, unknown>,
    index: number,
    isSubRow: boolean
  ): IRow {
    return {
      id: `match-${index}`,
      cells: [
        {
          id: `field-${index}`,
          value: String(isSubRow ? match.originalField : match.field),
          style: header.cells[0].style,
        },
        {
          id: `term-${index}`,
          value: String(match.query),
          style: header.cells[1].style,
        },
        {
          id: `weight-${index}`,
          value: roundNumber(Number(Number(match.weight)), 2, true),
          style: header.cells[2].style,
        },
        {
          id: `score-${index}`,
          value: Number(match.score),
          style: header.cells[3].style,
        },
      ],
    }
  }

  function handleToggle(): void {
    setOpen((curr) => !curr)
  }

  function getMatchTable(
    header: IRow,
    explainProduct: IGraphqlExplainProduct
  ): ReactNode {
    let totalFieldScore = 0
    const rows: Record<string, IRow> = {}

    explainProduct.matches.forEach((match, index) => {
      const field = String(match.field)
      totalFieldScore += Number(match.score)

      if (field in rows) {
        if ('subRows' in rows[field]) {
          rows[field] = {
            ...rows[field],
            subRows: [
              ...rows[field].subRows,
              getMatchTableRow(match, index, true),
            ],
          }
        } else {
          const rowsClone = JSON.parse(JSON.stringify(rows[field]))
          rowsClone.cells[0].value = String(
            explainProduct.matches[
              explainProduct.matches.findIndex((item) => field === item.field)
            ].originalField
          )

          rows[field] = {
            ...rows[field],
            subRows: [{ ...rowsClone }, getMatchTableRow(match, index, true)],
          }
          rows[field].cells[1].value = ''
          rows[field].cells[2].value = ''
        }
        rows[field].cells[3].value =
          Number(rows[field].cells[3].value) + Number(match.score)
      } else {
        rows[field] = getMatchTableRow(match, index, false)
      }
    })

    const matches: IRow[] = Object.values(rows).map((match) => {
      match.cells[3].value = roundNumber(Number(match.cells[3].value), 2, true)
      if ('subRows' in match) {
        match.subRows.forEach((subMatch) => {
          subMatch.cells[3].value = roundNumber(
            Number(subMatch.cells[3].value),
            2,
            true
          )
        })
      }
      return match
    })

    const body = [
      ...matches,
      {
        id: 'total-field-score',
        important: true,
        cells: [
          {
            id: 'total-field-score-1',
            value: t('Total score'),
          },
          {
            id: 'total-field-score-2',
            value: '',
          },
          {
            id: 'total-field-score-3',
            value: '',
          },
          {
            id: 'total-field-score-4',
            value:
              Object.keys(explainProduct?.boosts).length > 0
                ? roundNumber(Number(totalFieldScore), 2, true)
                : roundNumber(Number(explainProduct.score), 2, true),
            style: {
              textAlign: 'right',
            } as CSSProperties,
          },
        ],
      },
      {
        id: 'total-boost-score',
        important: true,
        cells: [
          {
            id: 'total-boost-score-1',
            value: t('Score after application of the boosts'),
          },
          {
            id: 'total-boost-score-2',
            value: '',
          },
          {
            id: 'total-boost-score-3',
            value: '',
          },
          {
            id: 'total-field-score-4',
            value: roundNumber(Number(explainProduct.score), 2, true),
            style: {
              textAlign: 'right',
            } as CSSProperties,
          },
        ],
      },
    ]

    return <ReadOnlyTable header={header} body={body} fullWidth />
  }

  function getIndexedContentTable(
    explainProduct: IGraphqlExplainProduct
  ): ReactNode {
    const header: IRow = {
      cells: [
        {
          id: 'field',
          value: t('Field'),
          style: {
            width: '344px',
          },
        },
        {
          id: 'source',
          value: t('Source'),
          style: {
            width: '200px',
          },
        },
      ],
    }

    const body: IRow[] = explainProduct?.highlights?.map((content) => ({
      id: String(content?.field),
      cells: [
        {
          id: `${String(content?.field)}-field`,
          value: String(content?.field),
        },
        {
          id: `${String(content?.field)}-source`,
          value:
            content?.value instanceof Array
              ? content.value.join(', ')
              : String(content?.value),
          style: {
            fontWeight: 'normal',
            color: '#424880',
          },
        },
      ],
    }))
    return <ReadOnlyTable header={header} body={body} fullWidth />
  }

  return (
    <ExplainDetailsStyled>
      <div className="header">
        <h4>{t('Details score')}</h4>
        <span>{explainProduct.name}</span>
      </div>

      <div className="general-information">
        <h6>{t('General information')}</h6>
        <span>{`${t('Code')}: ${explainProduct?.sku}`}</span>
        <span>{`${t('Price')}: ${
          explainProduct?.price[0]
            ? formatPrice(explainProduct?.price[0]?.price, currency, language)
            : ``
        }`}</span>
        <span>{`${t('Stock')}: ${
          explainProduct?.stock?.status
            ? t(getStockStatusLabel(Boolean(explainProduct.stock.status)), {
                ns: 'common',
              })
            : ``
        } `}</span>
      </div>
      {explainProduct.matches.length > 0 && (
        <div className="item">
          <h6>
            {t('Matches')}
            <PopIn
              triggerElement={<IonIcon name="help-circle-outline" />}
              position="center"
              boxStyle={{ display: 'inline', margin: '5px 0 0 5px' }}
            >
              <AnalyzerLegends>
                <div className="header">
                  <IonIcon name="help-circle-outline" />
                  <h4>{t('Matches explanation')}</h4>
                </div>
                <ul>
                  {Object.keys(explainProduct.legends).map((key) => (
                    <li key={key}>
                      <span className="field">{`${explainProduct.legends[key].field}`}</span>
                      : {`${explainProduct.legends[key].legend}`}
                    </li>
                  ))}
                </ul>
              </AnalyzerLegends>
            </PopIn>
          </h6>
          {getMatchTable(header, explainProduct)}
        </div>
      )}

      {explainProduct.highlights.length > 0 && (
        <div className="item">
          <h6 className="collapse">
            {t('Indexed content')}
            <IonIcon
              onClick={handleToggle}
              name={open ? 'remove-circle' : 'add-circle'}
            />
          </h6>
          <Collapse in={open} timeout="auto">
            {getIndexedContentTable(explainProduct)}
          </Collapse>
        </div>
      )}
    </ExplainDetailsStyled>
  )
}

export default ExplainDetails
