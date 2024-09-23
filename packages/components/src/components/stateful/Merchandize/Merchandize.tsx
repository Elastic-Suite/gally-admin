import React, { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Grid, Paper } from '@mui/material'
import {
  ICategory,
  IOptions,
  IParsedCategoryConfiguration,
  IRuleCombination,
  getFieldConfig,
  getFieldState,
  isRuleValid,
  isVirtualCategoryEnabled,
} from '@elastic-suite/gally-admin-shared'

import { useResource, useRuleOperators } from '../../../hooks'
import { selectBundles, useAppSelector } from '../../../store'

import DropDownWithoutError from '../../atoms/form/DropDownWithoutError'
import Switch from '../../atoms/form/Switch'
import RulesManager from '../RulesManager/RulesManager'

interface IProps {
  catConf: IParsedCategoryConfiguration
  onChange?: (
    name: string,
    value: boolean | string | IRuleCombination
  ) => void | Promise<void>
  sortOptions: IOptions<string>
  category: ICategory
}

function Merchandize({
  catConf,
  onChange,
  sortOptions,
  category,
}: IProps): JSX.Element {
  const { t } = useTranslation('categories')
  const bundles = useAppSelector(selectBundles)
  const catConfResource = useResource('CategoryConfiguration')
  const fieldConfigMap = new Map(
    catConfResource.supportedProperty.map((field) => [
      field.title,
      getFieldConfig(field),
    ])
  )

  // Rule engine operators
  const ruleOperators = useRuleOperators()

  const isValid = !catConf?.isVirtual || isRuleValid(catConf?.virtualRule)

  function handleChange(value: string | boolean, event: SyntheticEvent): void {
    onChange((event.target as HTMLInputElement).name, value)
  }

  const isRootCategory = category.level === 1

  return (
    <Paper variant="outlined" style={{ height: 'auto', padding: '22px' }}>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={6}>
          <Switch
            checked={catConf?.useNameInProductSearch ?? false}
            infoTooltip={t('name.tooltip')}
            label={t('name')}
            name="useNameInProductSearch"
            onChange={handleChange}
            {...getFieldState(
              catConf as unknown as Record<string, unknown>,
              fieldConfigMap.get('useNameInProductSearch')?.depends
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <DropDownWithoutError
            infoTooltip={t('select.tooltip')}
            label={t('select.label')}
            name="defaultSorting"
            onChange={handleChange}
            options={sortOptions}
            value={catConf?.defaultSorting ?? ''}
            required
            {...getFieldState(
              catConf as unknown as Record<string, unknown>,
              fieldConfigMap.get('defaultSorting')?.depends
            )}
          />
        </Grid>
        {isVirtualCategoryEnabled(bundles) && (
          <Grid item xs={6}>
            <Switch
              checked={catConf?.isVirtual ?? false}
              infoTooltip={t('virtual.tooltip')}
              label={t('virtual')}
              name="isVirtual"
              disabled={isRootCategory}
              onChange={handleChange}
              {...getFieldState(
                catConf as unknown as Record<string, unknown>,
                fieldConfigMap.get('isVirtual')?.depends
              )}
            />
          </Grid>
        )}
      </Grid>
      {isVirtualCategoryEnabled(bundles) &&
      ruleOperators &&
      catConf?.isVirtual ? (
        <Grid
          item
          xs={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          <RulesManager
            label={t('virtualRule.title')}
            active={catConf?.isVirtual}
            onChange={(value): void => {
              onChange('virtualRule', value)
            }}
            rule={catConf?.virtualRule}
            ruleOperators={ruleOperators}
            error={!isValid}
          />
        </Grid>
      ) : null}
    </Paper>
  )
}

export default Merchandize
