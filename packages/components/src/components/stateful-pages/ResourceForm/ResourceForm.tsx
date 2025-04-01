import React, { FormEvent, useEffect, useState } from 'react'

import {
  useApiFetch,
  useLog,
  useResource,
  useResourceOperations,
} from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import BackToLastPage from '../../atoms/backToLastPage/BackToLastPage'
import {
  IErrorsForm,
  IMainContext,
  concatenateValuesWithLineBreaks,
  firstLetterUppercase,
  initResourceData,
  isError,
} from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import { Box, Theme } from '@mui/material'
import { useRouter } from 'next/router'
import PageTitle from '../../atoms/PageTitle/PageTitle'
import PopIn from '../../atoms/modals/PopIn'
import { styled } from '@mui/system'
import Form from '../../atoms/form/Form'
import { MainSectionFieldSet } from '../../organisms/CustomForm/CustomForm.styled'
import IonIcon from '../../atoms/IonIcon/IonIcon'

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
  entityLabel?: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { resourceName, id, title, entityLabel } = props
  const entity = (entityLabel ?? resourceName).toLowerCase()
  const { t } = useTranslation('resourceForm')
  const resource = useResource(resourceName, IMainContext.FORM)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { replace, create, remove } = useResourceOperations<any>(resource)
  const [errors, setErrors] = useState<IErrorsForm>()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState<Record<string, unknown>>(
    id ? {} : initResourceData(resource)
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

  async function sendingData(): Promise<unknown> {
    setIsLoading(true)
    let sendingToApi
    if (id) {
      sendingToApi = await replace(data)
    } else {
      sendingToApi = await create(data)
    }
    if (!isError(sendingToApi)) {
      setData(sendingToApi)
      enqueueSnackbar(
        id ? t('alert.update', { entity }) : t('alert.create', { entity }),
        {
          onShut: closeSnackbar,
          variant: 'success',
        }
      )
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
      enqueueSnackbar(firstLetterUppercase(t('alert.remove', { entity })), {
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
  const [showAllErrors, setShowAllErrors] = useState(false)

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
        {title ? (
          <PageTitle title={title} sx={{ marginBottom: '32px' }} sticky>
            <CustomDoubleButtonSticky>
              <BackToLastPage urlRedirection="./grid" />
              {id ? (
                <PopIn
                  confirmationPopIn
                  position="center"
                  onConfirm={deleteData}
                  titlePopIn={t('confirmation.message.delete', { entity })}
                  cancelName={t('cancel')}
                  confirmName={t('confirm')}
                  triggerElement={
                    <Button
                      display="secondary"
                      disabled={isLoading}
                      data-testid="deleteButtonResourceForm"
                      endIcon={<IonIcon name="trash-outline" />}
                    >
                      {t('delete')}
                    </Button>
                  }
                  loading={isLoading}
                />
              ) : null}
              <Box>
                <Button
                  type="submit"
                  data-testid="submitButtonResourceForm"
                  loading={isLoading}
                  endIcon={
                    id ? (
                      <IonIcon name="save-outline" />
                    ) : (
                      <IonIcon name="add-circle-outline" />
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
          showAllErrors={showAllErrors}
          onChange={setData}
          resource={resource}
          errors={errors}
        />
      </Form>
      <CustomForm
        data={data}
        showAllErrors={showAllErrors}
        onChange={setData}
        resource={resource}
        errors={errors}
        externalFieldSet
      />
    </MainSectionFieldSet>
  )
}

export default ResourceForm
