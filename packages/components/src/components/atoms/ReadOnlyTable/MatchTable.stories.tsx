import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ReadOnlyTableComponent from './ReadOnlyTable'
import { IRow } from './ReadOnlyTable.styled'
import { action } from '@storybook/addon-actions'

export interface IMatch {
  field: string
  term: string
  weight: number | string
  score: number
  subMatches?: IMatch[]
}

export interface IBoost {
  name: string
  model: string
  score: string
  action: () => void
}

export default {
  title: 'Atoms/ReadOnlyTable',
  component: ReadOnlyTableComponent,
} as ComponentMeta<typeof ReadOnlyTableComponent>

const Template: ComponentStory<typeof ReadOnlyTableComponent> = (args) => (
  <ReadOnlyTableComponent {...args} />
)

const header: IRow = {
  cells: [
    {
      id: 'header-1',
      value: 'Field',
      style: {
        width: '344px',
      },
    },
    {
      id: 'header-2',
      value: 'Term',
      style: {
        width: '200px',
      },
    },
    {
      id: 'header-3',
      value: 'Weight',
      style: {
        width: '87.33px',
      },
    },
    {
      id: 'header-4',
      value: 'Score',
      style: {
        width: '107.33px',
        textAlign: 'right',
      },
    },
  ],
}

const convertMatchToRow = (id: string, match: IMatch): IRow => {
  const subRows = match.subMatches?.map((subMatch, index) => {
    return convertMatchToRow(`${id}.${index}`, subMatch)
  })

  return {
    id: `matchRow.${id}`,
    cells: [
      { id: `field${id}`, value: match.field, style: header.cells[0].style },
      { id: `term${id}`, value: match.term, style: header.cells[1].style },
      { id: `weight${id}`, value: match.weight, style: header.cells[2].style },
      {
        id: `score${id}`,
        value: match.score.toFixed(2),
        style: { textAlign: 'right', ...header.cells[3].style },
      },
    ],
    subRows,
  }
}

const convertBoostToRow = (id: string, boost: IBoost): IRow => {
  return {
    id: `boostRow.${id}`,
    cells: [
      {
        id: `nameBoost${id}`,
        value: boost.name,
        onClick: boost.action,
        style: header.cells[0].style,
      },
      {
        id: `modelBoost${id}`,
        value: boost.model,
        style: header.cells[1].style,
      },
      { id: `nothingBoost${id}`, value: '', style: header.cells[2].style },
      {
        id: `scoreBoost${id}`,
        value: boost.score,
        style: { textAlign: 'right', ...header.cells[3].style },
      },
    ],
  }
}

const createMatch = (
  field: IMatch['field'],
  term: IMatch['term'],
  weight: IMatch['weight'],
  score: IMatch['score'],
  subMatches?: IMatch['subMatches']
): IMatch => ({
  field,
  term,
  weight,
  score,
  subMatches,
})

const createBoost = (
  name: IBoost['name'],
  model: IBoost['model'],
  score: IBoost['score'],
  action: IBoost['action']
): IBoost => ({
  name,
  model,
  score,
  action,
})

const body = [
  convertMatchToRow(
    '1',
    createMatch('search whitespace', 'lorem ipsum dolors', 22, 29.75)
  ),
  convertMatchToRow('2', createMatch('search', 'dress', 2.2, 2.02)),
  convertMatchToRow('3', createMatch('spelling', 'dress', 3, 1.0)),
  convertMatchToRow(
    '4',
    createMatch('name', '', '', 118.29, [
      createMatch('name.whitespace', 'dress', 110, 107.54),
      createMatch('name.standard', 'dress', 11, 10.75),
    ])
  ),
  {
    id: 'totalScoreMatch',
    important: true,
    cells: [
      {
        id: 'field-total',
        value: "Total field's score",
      },
      {
        id: 'term-total',
        value: '',
      },
      {
        id: 'weight-total',
        value: '',
      },
      {
        id: 'scoe-total',
        value: 158.08,
        style: { textAlign: 'right' },
      },
    ],
  },
  {
    id: 'BoostsRow',
    cells: [
      {
        id: 'field-boost',
        value: `Boosts (3)`,
        bold: true,
      },
      {
        id: 'term-boost',
        value: '',
      },
      {
        id: 'weight-v',
        value: '',
      },
      {
        id: 'score-boost',
        value: 11.59,
        bold: true,
        style: { textAlign: 'right' },
      },
    ],
    subRows: [
      {
        id: 'header-boost',
        cells: [
          {
            id: 'boost-header-1',
            value: 'Name',
            bold: true,
          },
          {
            id: 'boost-header-2',
            value: 'Model',
            bold: true,
          },
          {
            id: 'boost-header-3',
            value: '',
            bold: true,
          },
          {
            id: 'boost-header-4',
            value: 'Score',
            bold: true,
            style: { textAlign: 'right' },
          },
        ],
      },
      convertBoostToRow(
        '1',
        createBoost(
          'Most viewed products',
          'Based on behavioral data',
          '10*views',
          action('clicked')
        )
      ),
      convertBoostToRow(
        '2',
        createBoost(
          'Boost Lila products',
          'Constant score',
          '10%',
          action('clicked')
        )
      ),
      convertBoostToRow(
        '3',
        createBoost(
          'Boost fashion style',
          'Constant score',
          '36%',
          action('clicked')
        )
      ),
    ],
  },
  {
    id: 'scoreWithBoostRow',
    important: true,
    cells: [
      {
        id: 'name-boost-total',
        value: 'Score after application of the boosts',
        tooltip: {
          text: 'Some text to help',
          icon: 'help-circle-outline',
        },
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
        },
      },
      {
        id: 'model-boost-total',
        value: '',
      },
      {
        id: 'nothing-boost-total',
        value: '',
      },
      {
        id: 'score-boost-total',
        value: 1750.74,
        style: { textAlign: 'right' },
      },
    ],
  },
]

export const MatchTable = Template.bind({})
MatchTable.args = {
  header,
  body,
}
