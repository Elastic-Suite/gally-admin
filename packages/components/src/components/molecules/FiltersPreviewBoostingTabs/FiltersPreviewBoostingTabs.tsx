import React, { useState } from 'react'
import CustomTabs from '../layout/tabs/CustomTabs'
import TreeSelector from '../../atoms/form/TreeSelector'
import { ITab, ITreeItem } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'react-i18next'
import FiltersPreviewBoostingTab, {
  IContainerProps,
} from './FiltersPreviewBoostingTab'
import SearchBar from '../../atoms/form/SearchBar'
export interface IPreviewBoostFilter {
  type: 'search' | 'category'
  value: string | ITreeItem
}

interface IProps {
  onSendFilter: (filter: IPreviewBoostFilter) => void
  categories: ITreeItem[]
}

function FiltersPreviewBoostingTabs({
  onSendFilter,
  categories,
}: IProps): JSX.Element {
  const [category, setCategory] = useState<ITreeItem>(null)
  const [search, setSearch] = useState('')
  const [displayEmptyMessage, setDisplayEmptyMessage] = useState(true)

  const { t } = useTranslation('boost')
  const filterByTabId: IPreviewBoostFilter[] = [
    { type: 'search', value: search },
    { type: 'category', value: category },
  ]

  const tabs: ITab<IContainerProps>[] = [
    {
      label: t('searchCatalog'),
      Component: FiltersPreviewBoostingTab,
      id: 0,
      componentProps: {
        emptyMessage: t('emptySearchMessage'),
        displayEmptyMessage,
        input: (
          <SearchBar
            value={search}
            placeholder={t('search')}
            onChange={setSearch}
            onResearch={(): void => {
              if (displayEmptyMessage) setDisplayEmptyMessage(false)
              onSendFilter({ type: 'search', value: search })
            }}
          />
        ),
      },
    },
    {
      label: t('navigationCatalog'),
      Component: FiltersPreviewBoostingTab,
      id: 1,
      componentProps: {
        emptyMessage: t('emptyCategoryMessage'),
        displayEmptyMessage,
        input: (
          <TreeSelector
            data={categories}
            multiple={false}
            onChange={(value): void => {
              if (displayEmptyMessage) setDisplayEmptyMessage(false)
              setCategory(value)
              onSendFilter({ type: 'category', value: category })
            }}
            value={category}
            placeholder={t('selectCategory').toString()}
          />
        ),
      },
    },
  ]
  return (
    <CustomTabs
      tabs={tabs}
      onChange={(id): void => onSendFilter(filterByTabId[id])}
    />
  )
}

export default FiltersPreviewBoostingTabs
