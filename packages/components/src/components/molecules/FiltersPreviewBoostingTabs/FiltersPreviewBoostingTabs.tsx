import React, { useCallback, useMemo, useState } from 'react'
import CustomTabs from '../layout/tabs/CustomTabs'
import {
  IOptions,
  IRequestTypesOptions,
  ITab,
  ITreeItem,
  LimitationType,
} from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import FiltersPreviewBoostingTab, {
  IPropsFiltersPreviewBoostingTab,
} from './FiltersPreviewBoostingTab'
import SearchBar from '../../atoms/form/SearchBar'
import DropDown from '../../atoms/form/DropDown'
import TreeSelector from '../../atoms/form/TreeSelector'
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
  const sendFilter = useCallback(
    (tabId: number): void => {
      onSendFilter({
        type: requestTypes[tabId].value,
        search,
        category: category != null ? category.id : null,
      })
    },
    [category, onSendFilter, requestTypes, search]
  )

  const [showAllErrors, setShowAllErrors] = useState(false)

  const DrowDownLocalizedCatalog = useMemo(
    () => (
      <DropDown
        onChange={(value: string): void => {
          onLocalizedCatalogChange(value)
          setCategory(null)
        }}
        value={localizedCatalog}
        options={localizedCatalogsOptions}
        placeholder={tCommon('localizedCatalog.placeholder')}
        useGroups
        required
        showError={showAllErrors}
        sx={{ minWidth: '252.667px' }}
        label={tCommon('localizedCatalog')}
      />
    ),
    [
      localizedCatalog,
      localizedCatalogsOptions,
      onLocalizedCatalogChange,
      showAllErrors,
      tCommon,
    ]
  )

  const handleSearch = useCallback(
    (id: number, formIsValid: boolean): void => {
      if (formIsValid) {
        sendFilter(id)
      } else {
        setShowAllErrors(true)
      }
    },
    [sendFilter]
  )

  const tabs: ITab<IPropsFiltersPreviewBoostingTab>[] = useMemo(
    () =>
      requestTypes.map((requestType, id) => {
        switch (requestType.limitationType) {
          case LimitationType.CATEGORY:
            return {
              label: requestType.previewLabel,
              Component: FiltersPreviewBoostingTab,
              id,
              componentProps: {
                onSearch: (formIsValid: boolean): void =>
                  handleSearch(id, formIsValid),
                children: (
                  <>
                    {DrowDownLocalizedCatalog}
                    <TreeSelector
                      showError={showAllErrors}
                      sx={{
                        minWidth: '252.667px',
                      }}
                      data={categories}
                      onChange={(value: ITreeItem): void => {
                        setCategory(value)
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
          case LimitationType.SEARCH:
            return {
              label: requestType.previewLabel,
              Component: FiltersPreviewBoostingTab,
              id,
              componentProps: {
                onSearch: (formIsValid: boolean): void =>
                  handleSearch(id, formIsValid),
                children: (
                  <>
                    {DrowDownLocalizedCatalog}
                    <SearchBar
                      value={search}
                      placeholder={tBoost('termSearch')}
                      onChange={setSearch}
                      showError={showAllErrors}
                      onResearch={(formIsValid): void =>
                        handleSearch(id, formIsValid)
                      }
                      label={tBoost('termSearch')}
                    />
                  </>
                ),
              },
            }
        }
        return null
      }),
    [
      DrowDownLocalizedCatalog,
      categories,
      category,
      handleSearch,
      requestTypes,
      search,
      showAllErrors,
      tBoost,
      tCommon,
    ]
  )

  const onTabChange = useCallback(
    (tabId: number): void => {
      sendFilter(tabId)
      setShowAllErrors(false)
    },
    [sendFilter, setShowAllErrors]
  )

  return (
    requestTypes.length > 0 && <CustomTabs tabs={tabs} onChange={onTabChange} />
  )
}

export default FiltersPreviewBoostingTabs
