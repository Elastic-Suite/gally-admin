import React, {FormEvent, useMemo, useEffect, useState} from 'react'

import {
  useApiFetch,
  useApiList,
} from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import {
  IErrorsForm,
  concatenateValuesWithLineBreaks,
  isError,
  IConfigurationTreeGroupFormatted, IResource, IConfiguration
} from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import { Box, Theme } from '@mui/material'
import PageTitle from '../../atoms/PageTitle/PageTitle'
import { styled } from '@mui/system'
import Form from '../../atoms/form/Form'
import { MainSectionFieldSet } from '../../organisms/CustomForm/CustomForm.styled'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import {
  contentTypeHeader,
  Method,
  DataContentType,
  ITabContentProps,
  IConfigurationTreeScope, ConfigurationScopeType, IConfigurationData,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared';
import EditableDropDownGuesser from "../../stateful/FieldGuesser/EditableDropDownGuesser";

const CustomDoubleButtonSticky = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: (theme as Theme).spacing(2),
}))

interface IViolations {
  propertyPath?: string
  message?: string
}

// todo: Faire le ménage de l'interface IProps, les champs optionnelles sont probablement inutiles.
interface IProps extends ITabContentProps {
  id?: string
  title?: string
  entityLabel?: string
  configurationResource: IResource
  configurationGroup: IConfigurationTreeGroupFormatted
  configurationScope: IConfigurationTreeScope
  configurationList: string[]
}


// todo move to service
function getConfigurationData(configurationList: string[], configurations: IConfiguration[]): IConfigurationData
{
  let data = {}
  configurationList.forEach((value) => {
    const configuration = configurations.find(item => item.path === value)
    if (configuration) {
      data = {...data, [value]: configuration.value}
    }
  })

   return data
}

// todo move to service
function getBulkConfigurations(configurationData: IConfigurationData, scopeType: ConfigurationScopeType, scopeCode: string): IConfiguration[]
{
  const bulk: IConfiguration[] = [];
  const isGeneralScope = scopeCode === ConfigurationScopeType.SCOPE_GENERAL
  for (const [path, value] of Object.entries(configurationData)) {
    bulk.push({
      path,
      value,
      scopeType: (isGeneralScope ? ConfigurationScopeType.SCOPE_GENERAL : scopeType),
      scopeCode: (isGeneralScope ? null : scopeCode),
    })
  }

  return bulk
}

/** RAF
 * Tester toutes les combinaisons possibles d'affichage avec les différentes config + tous les composants form et arbitrer de l'utilité ?
 * Ne pas save les configs qui ne changent pas ?
 * Title (dans le navigateur) de la page n'est pas défini.
 * Vérifier si les validations fonctionnent + le required (si on met required false côté back est-ce que ça fonctionne?).
 */
function ConfigurationForm(props: IProps): JSX.Element {
  /*
    configurationResource: IResource
  configurationGroups: IConfigurationTreeGroupFormatted
  configurationList: string[]
   */
  const { id, title, entityLabel, configurationResource, configurationGroup, configurationScope, configurationList } = props
  const resourceName = "Boost"
  const entity = (entityLabel ?? resourceName).toLowerCase()
  const { t } = useTranslation('resourceForm')
  const [errors, setErrors] = useState<IErrorsForm>()

  const [isLoading, setIsLoading] = useState(false)

  const [scopeCode, setScopeCode] = useState<string>(ConfigurationScopeType.SCOPE_GENERAL)
  const [configurationData, setConfigurationData] = useState<IConfigurationData>({})
  const [showAllErrors, setShowAllErrors] = useState(false)
  const fetchApi = useApiFetch()


  const filters = useMemo( () => (
      {'path[]': configurationList, [configurationScope.filterName]: scopeCode}
    ),
    [configurationList, configurationScope, scopeCode]
  )

  const [configurations] =
      useApiList<IConfiguration>(
        'configurations',
        false,
        0,
        filters,
        undefined,
        false,
        false
      )

 // todo voir avec Aurélien si c'est le bon move ?
  useEffect(() => {
    if (configurations.status === LoadStatus.SUCCEEDED) {
      setConfigurationData(getConfigurationData(configurationList, configurations.data['hydra:member']))
    }
  }, [configurations, configurationList])


  //todo: à mutualiser avec ResouceForm
  function transformPropertyPath(propertyPath: string): string {
    switch (propertyPath) {
      case 'fromDate':
      case 'toDate':
        return 'doubleDatePicker'

      default:
        return propertyPath
    }
  }

  async function sendingData(): Promise<void> {
    setIsLoading(true)
    const sendingToApi = await fetchApi<IConfiguration>('/configurations/bulk', undefined, {
      body: JSON.stringify(getBulkConfigurations(configurationData, configurationGroup.scopeType, scopeCode)),
      method: Method.POST,
      headers: { [contentTypeHeader]: 'application/ld+json' },
    })

    if (!isError(sendingToApi)) {
      //todo: set dans le state les données recupérer dans le retour du fetchApi.
      // setData(sendingToApi)
      enqueueSnackbar(
        id ? t('alert.update', { entity }) : t('alert.create', { entity }),
        {
          onShut: closeSnackbar,
          variant: 'success',
        }
      )
    } else {
      //todo: Gestion des messages à mutualiser avec ResouceForm
      const newErrors: IErrorsForm = { fields: {}, global: [] }

      sendingToApi?.violations?.forEach((err: IViolations) => {
        if (err?.propertyPath && err?.message) {
          newErrors.fields[transformPropertyPath(err?.propertyPath)] =
            err.message
        } else if (err?.message) {
          newErrors.global.push(err.message)
        }
      })

      enqueueSnackbar(t('error.form'), {
        onShut: closeSnackbar,
        variant: 'error',
      })

      if (newErrors.global.length !== 0) {
        enqueueSnackbar(concatenateValuesWithLineBreaks(newErrors.global), {
          onShut: closeSnackbar,
          variant: 'error',
          style: { whiteSpace: 'pre-line' },
          autoHideDuration: Infinity,
        })
      }
      setErrors(newErrors)
    }
    setIsLoading(false)
  }

  function handleScopeChange(value: string): void {
      setScopeCode(value)
  }

  function handleChange(value: IConfigurationData): void {
    setConfigurationData(value)
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
          <PageTitle title={title} sx={{ marginBottom: '32px' }} sticky>
            <CustomDoubleButtonSticky>
              <Box>
                {/*// todo: Add default dropdown value general (general  == default scope).*/}
                <EditableDropDownGuesser
                  onChange={handleScopeChange}
                  value={scopeCode}
                  data={{}}
                  label={configurationScope.label}
                  id={'configurationScopeType'}
                  name={'configurationScopeType'}
                  useGroups={configurationScope.input === DataContentType.OPTGROUP}
                  field={{
                    '@type': '',
                    description: configurationScope.label,
                    property: {
                      '@id': `#Configuration\\configurationScopeType\\${configurationGroup.scopeType}`,
                      '@type': '',
                      domain: {
                        '@id': '',
                      },
                      label: configurationScope.label,
                    },
                    readable:  true,
                    required: true,
                    title: configurationScope.label,
                    writeable: true,
                    gally: {options: configurationScope.options}
                  }}
                  required
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  componentId="submit"
                  loading={isLoading}
                  endIcon={<IonIcon name="save-outline" />}
                >
                  {t('save')}
                </Button>
              </Box>
            </CustomDoubleButtonSticky>
          </PageTitle>

        <CustomForm
          data={configurationData}
          showAllErrors={showAllErrors}
          onChange={handleChange}
          resource={configurationResource}
          errors={errors}
        />
      </Form>
      {/*todo: comprendre à quoi sert ce deuxième Custom Form, il est très probablement utilisé dans le cas d'external fieldset*/}
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
