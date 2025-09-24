import React, { FormEvent, useEffect, useMemo, useState } from 'react'

import { useApiFetch, useApiList } from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import {
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
import { TestId } from '../../../utils/testIds'
import Alert from '../../atoms/Alert/Alert'

const StickyRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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
  marginBottom: (theme as Theme).spacing(1),
}))

const FlexBox = styled(Box)(() => ({
  flex: 1,
}))

const RightAlignedButton = styled(Box)(({ theme }) => ({
  gap: (theme as Theme).spacing(2),
}))

const FormWithWiderInputs = styled(Form)(() => ({
  '& input[type="text"], & input[type="email"]': {
    minWidth: '400px',
    width: '100%',
  },
  'input[type="number"]': {
    width: '75px',
  },
}))

interface IProps extends ITabContentProps {
  configurationResource: IResource
  configurationGroup: IConfigurationTreeGroupFormatted
  configurationScope: IConfigurationTreeScope
  configurationList: string[]
}

function ConfigurationForm(props: IProps): JSX.Element {
  const {
    configurationResource,
    configurationGroup,
    configurationScope,
    configurationList,
  } = props
  const { t } = useTranslation(['resourceForm', 'configurations'])
  const [errors, setErrors] = useState<IErrorsForm>()
  const [showWarning, setShowWarning] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const [scopeCode, setScopeCode] = useState<string | null>(null)
  const [originalConfigurationData, setOriginalConfigurationData] =
    useState<IConfigurationData>({})
  const [configurationData, setConfigurationData] =
    useState<IConfigurationData>({})
  const [showAllErrors, setShowAllErrors] = useState(false)
  const fetchApi = useApiFetch()

  const dirtyFields = useMemo(() => {
    if (!originalConfigurationData) {
      return configurationData
    }

    return Object.fromEntries(
      Object.entries(configurationData).filter(
        ([key, value]) => originalConfigurationData[key] !== value
      )
    )
  }, [configurationData, originalConfigurationData])

  const disableSubmit = useMemo(() => {
    return isLoading || Object.keys(dirtyFields).length === 0
  }, [isLoading, dirtyFields])

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

  function onSendingDataSuccess(configurationData: IConfigurationData): void {
    const updatedCount = Object.keys(dirtyFields).length
    enqueueSnackbar(
      t('updatedConfigurations.info', {
        count: updatedCount,
        ns: 'configurations',
      }),
      {
        onShut: closeSnackbar,
        variant: 'success',
      }
    )
    // Sets new configuration data as original one so it serves as basis for next changes comparison
    setOriginalConfigurationData(configurationData)
  }

  function onFormErrors(event: FormEvent<HTMLFormElement>): void {
    setShowAllErrors(true)
    const { invalidElementsCount, firstInvalidElement } =
      checkInvalidElements(event)
    enqueueSnackbar(
      t('invalidConfigurations.alert', {
        count: invalidElementsCount,
        ns: 'configurations',
      }),
      {
        onShut: closeSnackbar,
        variant: 'error',
      }
    )
    firstInvalidElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }

  async function sendingData(): Promise<void> {
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
    setShowAllErrors(false)
  }

  function handleChange(value: IConfigurationData): void {
    setConfigurationData(value)
  }

  function checkInvalidElements(event: FormEvent<HTMLFormElement>): {
    invalidElementsCount: number
    firstInvalidElement: HTMLFormElement | null
  } {
    const form = event.currentTarget

    // Get all form elements
    const formElements = Array.from(form.elements) as HTMLFormElement[]

    let firstInvalidElement: HTMLFormElement = null
    // Count invalid elements using checkValidity()
    const invalidElements = formElements.filter((element) => {
      // Check if element supports validation
      if ('checkValidity' in element) {
        firstInvalidElement =
          !firstInvalidElement && !element.checkValidity()
            ? element
            : firstInvalidElement
        return !element.checkValidity()
      }
      return false
    })

    return { invalidElementsCount: invalidElements.length, firstInvalidElement }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      sendingData()
    } else {
      onFormErrors(event)
    }
  }

  return (
    <>
      {Boolean(showWarning) && (
        <Alert
          message={t('dangerousChanges.warning', { ns: 'configurations' })}
          variant="warning"
          style={{ marginBottom: 0 }}
          onShut={(): void => setShowWarning(false)}
        />
      )}
      <MainSectionFieldSet>
        <FormWithWiderInputs
          data-testid={TestId.CONFIGURATION_FORM}
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
                <EditableDropDownGuesser
                  componentId="configurationScopeType"
                  onChange={handleScopeChange}
                  value={scopeCode}
                  data={{}}
                  label={t('configurationAppliesTo.label', {
                    ns: 'configurations',
                  })}
                  id="configurationScopeType"
                  name="configurationScopeType"
                  useGroups={
                    configurationScope.input === DataContentType.OPTGROUP
                  }
                  field={formatConfigurationScopeField(
                    configurationGroup,
                    configurationScope
                  )}
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
        </FormWithWiderInputs>
        <CustomForm
          data={configurationData}
          showAllErrors={showAllErrors}
          onChange={handleChange}
          resource={configurationResource}
          errors={errors}
          externalFieldSet
        />
      </MainSectionFieldSet>
    </>
  )
}

export default ConfigurationForm
