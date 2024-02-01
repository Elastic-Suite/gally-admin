import React, { useState } from 'react'
import CustomTabs from '../layout/tabs/CustomTabs'
import TreeSelector from '../../atoms/form/TreeSelector'
import {
  IOptions,
  IRequestTypesOptions,
  ITab,
  ITreeItem,
} from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import FiltersPreviewBoostingTab, {
  IPropsFiltersPreviewBoostingTab,
} from './FiltersPreviewBoostingTab'
import SearchBar from '../../atoms/form/SearchBar'
import DropdownError from '../../atoms/form/DropDownError'
export interface IPreviewBoostFilter {
  type: string
  search?: string
  category?: string | number
}

interface IProps {
  onSendFilter: (filter: IPreviewBoostFilter) => void
  categories: ITreeItem[]
  localizedCatalogsOptions: IOptions<string>
  localizedCatalog: string
  requestTypes: IRequestTypesOptions[]
  onLocalizedCatalogChange: (localizedCatalog: string) => void
}

function FiltersPreviewBoostingTabs({
  onSendFilter,
  categories,
  localizedCatalogsOptions,
  requestTypes,
  onLocalizedCatalogChange,
  localizedCatalog,
}: IProps): JSX.Element {
  const { t: tBoost } = useTranslation('boost')
  const { t: tCommon } = useTranslation('common')

  const [category, setCategory] = useState<ITreeItem>(null)
  const [search, setSearch] = useState('')
  const [localizedCatalogError, setLocalizedCatalogError] = useState(false)
  const sendFilter = (tabId: number): void => {
    onSendFilter({
      type: requestTypes[tabId].value,
      search,
      category: category != null ? category.id : null,
    })
  }

  const DrowDownLocalizedCatalog = (
    <DropdownError
      onChange={(value: string): void => {
        setLocalizedCatalogError(Boolean(!value))
        onLocalizedCatalogChange(value)
        setCategory(null)
      }}
      value={localizedCatalog}
      options={localizedCatalogsOptions}
      placeholder={tCommon('localizedCatalog.placeholder')}
      useGroups
      required
      showError
      sx={{ minWidth: '252.667px' }}
      label={tCommon('localizedCatalog')}
      error={localizedCatalogError}
      helperText={
        Boolean(localizedCatalogError) && tCommon('formError.valueMissing')
      }
      helperIcon={Boolean(localizedCatalogError) && 'close'}
    />
  )

  const tabs: ITab<IPropsFiltersPreviewBoostingTab>[] = requestTypes.map(
    (requestType, id) => {
      switch (requestType.limitationType) {
        case 'category':
          return {
            label: requestType.previewLabel,
            Component: FiltersPreviewBoostingTab,
            id,
            componentProps: {
              buttonDisabled: !(Boolean(localizedCatalog) && Boolean(category)),
              onSearch: () => sendFilter(id),
              children: (
                <>
                  {DrowDownLocalizedCatalog}
                  <TreeSelector
                    sx={{
                      minWidth: '252.667px',
                    }}
                    data={categories}
                    onChange={(value: ITreeItem): void => {
                      setCategory(value)
                      if (!localizedCatalog) setLocalizedCatalogError(true)
                    }}
                    value={category}
                    placeholder={tBoost('selectCategory').toString()}
                    required
                    label={tCommon('category')}
                  />
                </>
              ),
            },
          }
        case 'search':
          return {
            label: requestType.previewLabel,
            Component: FiltersPreviewBoostingTab,
            id,
            componentProps: {
              buttonDisabled: !(Boolean(localizedCatalog) && search !== ''),
              onSearch: () => sendFilter(id),
              children: (
                <>
                  {DrowDownLocalizedCatalog}
                  <SearchBar
                    value={search}
                    placeholder={tBoost('termSearch')}
                    onChange={setSearch}
                    onResearch={(): void => {
                      sendFilter(id)
                      if (!localizedCatalog) setLocalizedCatalogError(true)
                    }}
                    label={tBoost('termSearch')}
                  />
                </>
              ),
            },
          }
      }
      return null
    }
  )
  return (
    requestTypes.length > 0 && (
      <CustomTabs
        tabs={tabs}
        onChange={(tabId: number): void => sendFilter(tabId)}
      />
    )
  )
}

export default FiltersPreviewBoostingTabs
