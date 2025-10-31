import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ICategories, ICategory } from '@elastic-suite/gally-admin-shared'
import { styled } from '@mui/system'
import classNames from 'classnames'

import { breadcrumbContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import { useFetchApi, useFilters, useResource } from '../../../hooks'

import TitleBlock from '../../../components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '../../../components/molecules/layout/twoColsLayout/TwoColsLayout'
import CategoryTree from '../../../components/stateful/CategoryTree/CategoryTree'

import ResourceTable from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import IonIcon from '../../../components/atoms/IonIcon/IonIcon'
import PageTitle from '../../../components/atoms/PageTitle/PageTitle'
import Alert from '../../../components/atoms/Alert/Alert'
import { TestId, generateTestId } from '../../../utils/testIds'
import { Box } from '@mui/material'

const ButtonSetting = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  gap: '5px',
  '&.selected': {
    color: theme.palette.colors.secondary[600],
    textDecoration: 'underline',
  },
}))

const IonIconStyle = styled(IonIcon)(() => ({
  width: '30px',
  fontSize: '20px',
}))

const DefaultButton = styled('button')(() => ({
  fontWeight: 500,
  fontFamily: 'var(--gally-font)',
  lineHeight: '18px',
  fontSize: '12px',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'inherit',
}))

const StyledCategoriesTree = styled('div')({
  '& li': {
    minWidth: '180px',
    width: 'auto',
    height: 'unset',
    '& div': {
      height: 'unset',
      minHeight: '24px',
    },
  },
})

const pagesSlug = ['search', 'facets']

function AdminSearchFacets(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('facet')
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()

  // Breadcrumb
  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  // Categories
  const [categories] = useFetchApi<ICategories>(`categoryTree`)

  // Facet configuration
  const resource = useResource('FacetConfiguration')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const filters = useMemo(
    () => ({
      category: selectedCategoryItem?.id,
      'sourceField.metadata.entity': 'product',
    }),
    [selectedCategoryItem?.id]
  )

  const [isVisibleAlertFacets, setIsVisibleAlertFacets] = useState(true)
  const contentTitle = selectedCategoryItem?.name
    ? selectedCategoryItem?.name
    : selectedCategoryItem?.catalogName

  return (
    <>
      <TwoColsLayout
        left={[
          <Box
            key="configuration-title"
            sx={{
              flexShrink: 0,
            }}
          >
            <TitleBlock
              key="configuration"
              subtitle={t('facet.configuration')}
              title={t('facet.title')}
            >
              <ButtonSetting
                data-testid={generateTestId(TestId.FACETS_SETTINGS_BUTTON)}
                className={classNames({ selected: !selectedCategoryItem })}
                onClick={(): void => setSelectedCategoryItem(undefined)}
              >
                <IonIconStyle name="settings" />
                <DefaultButton>{t('facet.button.setting')}</DefaultButton>
              </ButtonSetting>
            </TitleBlock>
          </Box>,
          <TitleBlock key="categories" subtitle={t('facet.byCategory')}>
            <StyledCategoriesTree>
              <CategoryTree
                categories={categories.data}
                selectedItem={selectedCategoryItem}
                onSelect={setSelectedCategoryItem}
              />
            </StyledCategoriesTree>
          </TitleBlock>,
        ]}
        leftWidth={280}
      >
        <PageTitle
          data-testid={generateTestId(TestId.FACETS_PAGE_TITLE)}
          title={contentTitle ? contentTitle : t('facets')}
          sx={{ marginBottom: '32px' }}
        />
        {Boolean(isVisibleAlertFacets) && (
          <Alert
            message={t('facet.alert')}
            onShut={(): void => setIsVisibleAlertFacets(false)}
          />
        )}
        <ResourceTable
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          filters={filters}
          resourceName="FacetConfiguration"
          diffDefaultValues
          showSearch
        />
      </TwoColsLayout>
    </>
  )
}

export default withAuth()(withOptions(AdminSearchFacets))
