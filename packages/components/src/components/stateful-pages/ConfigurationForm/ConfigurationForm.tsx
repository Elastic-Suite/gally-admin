import React, { FormEvent, useEffect, useMemo, useState } from 'react'

import { useApiFetch, useApiList } from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import {
  ConfigurationScopeType,
  DataContentType,
  IConfiguration,
  IConfigurationData,
  IConfigurationTreeGroupFormatted,
  IConfigurationTreeScope,
  IErrorsForm,
  IResource,
  ITabContentProps,
  LoadStatus,
  Method,
  contentTypeHeader,
  isError,
} from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import { Box, Theme } from '@mui/material'
import { styled } from '@mui/system'
import Form from '../../atoms/form/Form'
import { MainSectionFieldSet } from '../../organisms/CustomForm/CustomForm.styled'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import EditableDropDownGuesser from '../../stateful/FieldGuesser/EditableDropDownGuesser'
import {
  formatConfigurationScopeField,
  getBulkConfigurations,
  getConfigurationData,
} from '../../../services/configuration'
import { handleFormErrors } from '../../../services'

const StickyRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'sticky',
  top: '84px',
  backgroundColor: theme.palette.background.page,
  zIndex: 5,
}))

const ScopeAndSaveToolbar = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  padding: (theme as Theme).spacing(2),
  gap: (theme as Theme).spacing(2),
  backgroundColor: theme.palette.colors.white,
  borderBottomLeftRadius: '5px',
  border: '1px solid #E2E6F3',
  width: '100%',
  marginBottom: (theme as Theme).spacing(1),
}))

const FlexBox = styled(Box)(() => ({
  flex: 1,
}))

const RightAlignedButton = styled(Box)(({ theme }) => ({
  gap: (theme as Theme).spacing(2),
}))

interface IProps extends ITabContentProps {
  configurationResource: IResource
  configurationGroup: IConfigurationTreeGroupFormatted
  configurationScope: IConfigurationTreeScope
  configurationList: string[]
}

/** RAF
 *
 * DONNÉES:
 *
 * 2/ Tester toutes les combinaisons possibles d'affichage avec les différentes config + tous les composants form et arbitrer de l'utilité ?
 * => Pierre va ajouter des configs qui correspondent aux cas réels
 *
 * 10/ Vérifier si les validations fonctionnent + le required (si on met required false côté back est-ce que ça fonctionne ?).
 * => Les contraintes de validations existent t'elles en back pour la config ?
 *
 * 4/ Design:
 *  => Allonger les champs
 *
 *  REFACTO:
 *  11/ Aller chercher les todos liés au refactoring pour isoler le code dans un (nouveau) service Config ou dans le service (existant) Form
 */
function ConfigurationForm(props: IProps): JSX.Element {
  const {
    configurationResource,
    configurationGroup,
    configurationScope,
    configurationList,
  } = props
  const entity = 'config'
  const { t } = useTranslation('resourceForm')
  const [errors, setErrors] = useState<IErrorsForm>()

  const [isLoading, setIsLoading] = useState(false)

  const [scopeCode, setScopeCode] = useState<string>(
    ConfigurationScopeType.SCOPE_GENERAL
  )
  const [originalConfigurationData, setOriginalConfigurationData] =
    useState<IConfigurationData>({})
  const [configurationData, setConfigurationData] =
    useState<IConfigurationData>({})
  const [showAllErrors, setShowAllErrors] = useState(false)
  const fetchApi = useApiFetch()

  const [disableSubmit, setDisableSubmit] = useState(true)

  const filters = useMemo(
    () => ({
      'path[]': configurationList,
      [configurationScope.filterName]: scopeCode,
    }),
    [configurationList, configurationScope, scopeCode]
  )

  const [configurations] = useApiList<IConfiguration>(
    'configurations',
    false,
    0,
    filters,
    undefined,
    false,
    false
  )

  useEffect(() => {
    if (configurations.status === LoadStatus.SUCCEEDED) {
      const loadedConfigurationData = getConfigurationData(
        configurationList,
        configurations.data['hydra:member']
      )
      setConfigurationData(loadedConfigurationData)
      setOriginalConfigurationData(loadedConfigurationData)
    }
  }, [configurations, configurationList])

  function getDirtyFields(
    configurationData: IConfigurationData
  ): IConfigurationData {
    if (!originalConfigurationData) {
      return configurationData
    }

    return Object.fromEntries(
      Object.entries(configurationData).filter(
        ([key, value]) => originalConfigurationData[key] !== value
      )
    )
  }

  function onSendingDataSuccess(configurationData: IConfigurationData): void {
    // Sets new configuration data as original one so it serves as basis for next changes comparison
    setOriginalConfigurationData(configurationData)
    enqueueSnackbar(t('alert.update', { entity }), {
      onShut: closeSnackbar,
      variant: 'success',
    })
  }

  async function sendingData(): Promise<void> {
    const dirtyFields = getDirtyFields(configurationData)
    // If nothing has changed we exit early to prevent button spam creating requests
    if (Object.keys(dirtyFields).length === 0) {
      onSendingDataSuccess(configurationData)
      return
    }

    setIsLoading(true)
    const sendingToApi = await fetchApi<IConfiguration>(
      '/configurations/bulk',
      undefined,
      {
        body: JSON.stringify(
          getBulkConfigurations(
            dirtyFields,
            configurationGroup.scopeType,
            scopeCode
          )
        ),
        method: Method.POST,
        headers: { [contentTypeHeader]: 'application/ld+json' },
      }
    )

    if (!isError(sendingToApi)) {
      onSendingDataSuccess(configurationData)
    } else {
      setErrors(handleFormErrors(sendingToApi, t))
    }
    setIsLoading(false)
  }

  function handleScopeChange(value: string): void {
    setScopeCode(value)
  }

  function handleChange(value: IConfigurationData): void {
    setConfigurationData(value)
    setDisableSubmit(Object.keys(getDirtyFields(value)).length === 0)
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      sendingData()
    } else {
      setShowAllErrors(true)
    }
  }

  return (
    <MainSectionFieldSet>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: 16,
          flexDirection: 'column',
        }}
      >
        <StickyRoot>
          <ScopeAndSaveToolbar>
            <FlexBox>
              {/*// todo: Add default dropdown value general (general  == default scope).*/}
              <EditableDropDownGuesser
                onChange={handleScopeChange}
                value={scopeCode}
                data={{}}
                label={configurationScope.label}
                id="configurationScopeType"
                name="configurationScopeType"
                useGroups={
                  configurationScope.input === DataContentType.OPTGROUP
                }
                field={formatConfigurationScopeField(
                  configurationGroup,
                  configurationScope
                )}
                required
              />
            </FlexBox>
            <RightAlignedButton>
              <Button
                type="submit"
                componentId="submit"
                disabled={disableSubmit}
                loading={isLoading}
                endIcon={<IonIcon name="save-outline" />}
              >
                {t('save')}
              </Button>
            </RightAlignedButton>
          </ScopeAndSaveToolbar>
        </StickyRoot>

        <CustomForm
          data={configurationData}
          showAllErrors={showAllErrors}
          onChange={handleChange}
          resource={configurationResource}
          errors={errors}
        />
      </Form>
      <CustomForm
        data={configurationData}
        showAllErrors={showAllErrors}
        onChange={handleChange}
        resource={configurationResource}
        errors={errors}
        externalFieldSet
      />
    </MainSectionFieldSet>
  )
}

export default ConfigurationForm
