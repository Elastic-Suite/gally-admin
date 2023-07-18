import React, { useEffect, useState } from 'react'

import {
  useApiFetch,
  useLog,
  useResource,
  useResourceOperations,
} from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import {
  IErrorsForm,
  IMainContext,
  IRule,
  concatenateValuesWithLineBreaks,
  initResourceData,
  isError,
  isRuleValid,
} from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { Box, Theme } from '@mui/material'
import { useRouter } from 'next/router'
import PageTitle from '../../atoms/PageTitle/PageTitle'
import PopIn from '../../atoms/modals/PopIn'

const CustomDoubleButtonSticky = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: (theme as Theme).spacing(2),
}))

interface IViolations {
  propertyPath?: string
  message?: string
}

interface IProps {
  id?: string
  resourceName: string
  title?: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { resourceName, id, title } = props
  const { t } = useTranslation('resourceForm')
  const resource = useResource(resourceName, IMainContext.FORM)
  const { replace, create, remove } = useResourceOperations<any>(resource)
  const [errors, setErrors] = useState<IErrorsForm>()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const requiredChamps = resource.supportedProperty.filter(
    (property) => property.required && property?.gally?.visible
  )

  const [data, setData] = useState<Record<string, unknown>>(
    id ? {} : initResourceData(resource)
  )

  const isValidRules =
    !data?.conditionRule ||
    isRuleValid(JSON.parse(data?.conditionRule as string) as IRule)

  const isValidForm =
    isValidRules &&
    !requiredChamps.some((it) =>
      typeof data?.[it.title] === 'string'
        ? !data?.[it.title as string]
        : (data?.[it.title] as unknown[])?.length === 0
    )

  const fetchApi = useApiFetch()
  const log = useLog()

  useEffect(() => {
    if (id) {
      fetchApi<Record<string, unknown>>(`${resource.url}/${id}`).then(
        (json) => {
          if (isError(json)) {
            return router.push('./grid')
          }
          setData(json)
        }
      )
    }
  }, [id, fetchApi, log, resource.url, router])

  function transformPropertyPath(propertyPath: string): string {
    switch (propertyPath) {
      case 'fromDate':
      case 'toDate':
        return 'doubleDatePicker'

      default:
        return propertyPath
    }
  }

  async function sendingData(): Promise<any> {
    setIsLoading(true)
    let sendingToApi
    if (id) {
      sendingToApi = await replace(data)
    } else {
      sendingToApi = await create(data)
    }
    if (!isError(sendingToApi)) {
      setData(sendingToApi)
      enqueueSnackbar(id ? t('alert.update') : t('alert.create'), {
        onShut: closeSnackbar,
        variant: 'success',
      })
      if (!id) {
        router.push('./grid')
        return
      }
    } else {
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

  async function deleteData(): Promise<void> {
    setIsLoading(true)
    const sendingToApi = await remove(id)
    if (!isError(sendingToApi)) {
      enqueueSnackbar(t('alert.remove'), {
        onShut: closeSnackbar,
        variant: 'success',
      })
      router.push('./grid')
      return
    }
    enqueueSnackbar(
      sendingToApi?.error?.message ?? sendingToApi?.violations[0]?.message,
      {
        onShut: closeSnackbar,
        variant: 'error',
      }
    )
    setIsLoading(false)
  }

  return (
    <>
      {title ? (
        <PageTitle title={title} sx={{ marginBottom: '32px' }} sticky>
          <CustomDoubleButtonSticky>
            {id ? (
              <PopIn
                onConfirm={deleteData}
                titlePopIn={t('confirmation.message.delete')}
                cancelName={t('cancel')}
                confirmName={t('confirm')}
                title={
                  <Button
                    display="secondary"
                    disabled={isLoading}
                    endIcon={<ion-icon name="trash-outline" />}
                  >
                    {t('delete')}
                  </Button>
                }
                loading={isLoading}
              />
            ) : null}
            <Box>
              <Button
                disabled={!isValidForm}
                onClick={sendingData}
                loading={isLoading}
                endIcon={
                  id ? (
                    <ion-icon name="save-outline" />
                  ) : (
                    <ion-icon name="add-circle-outline" />
                  )
                }
              >
                {id ? t('save') : t('create')}
              </Button>
            </Box>
          </CustomDoubleButtonSticky>
        </PageTitle>
      ) : null}
      <CustomForm
        data={data}
        onChange={setData}
        resource={resource}
        errors={errors}
      />
    </>
  )
}

export default ResourceForm
