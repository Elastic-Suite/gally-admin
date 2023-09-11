import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ReadOnlyTableComponent from './ReadOnlyTable'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Atoms/ReadOnlyTable',
  component: ReadOnlyTableComponent,
} as ComponentMeta<typeof ReadOnlyTableComponent>

const Template: ComponentStory<typeof ReadOnlyTableComponent> = (args) => (
  <ReadOnlyTableComponent {...args} />
)

export const DefaultCase = Template.bind({})

const header = {
  cells: [
    {
      id: 'header-1',
      value: 'Header 1',
      style: {
        width: '200px',
      },
    },
    {
      id: 'header-2',
      value: 'Header 2',
      style: {
        width: '200px',
      },
    },
    {
      id: 'header-3',
      value: 'Header 3',
      style: {
        width: '200px',
      },
    },
  ],
}

const body = [
  {
    id: 'row-1',
    cells: [
      {
        id: 'row-1',
        value: 'clickable value',
        onClick: action('clicked'),
      },
      {
        id: 'row-2',
        value: 'value 1.2',
      },
      {
        id: 'row-3',
        value: 'bold value',
        bold: true,
      },
    ],
  },
  {
    id: 'row-2',
    cells: [
      {
        id: 'row-1',
        value: 'value 2.1',
      },
      {
        id: 'row-2',
        value: 'value 2.2',
      },
      {
        id: 'row-3',
        value: 'value 2.3',
      },
    ],
    subRows: [
      {
        id: 'subrow-1',
        cells: [
          {
            id: 'subrow-1',
            value: 'subrow 2.1',
            style: header.cells[0].style,
          },
          {
            id: 'subrow-2',
            value: 'subrow 2.2.1',
            style: header.cells[1].style,
          },
          {
            id: 'subrow-3',
            value: 'subrow 2.3',
            style: header.cells[2].style,
          },
        ],
      },
    ],
  },
  {
    id: 'important-row-1',
    important: true,
    cells: [
      {
        id: 'important-row-1',
        value: 'Important row',
      },
      {
        id: 'important-row-2',
        value: '',
      },
      {
        id: 'important-row-3',
        value: '',
      },
    ],
  },
]

DefaultCase.args = {
  header,
  body,
}
