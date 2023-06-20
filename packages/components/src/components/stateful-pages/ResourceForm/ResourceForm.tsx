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
  IMainContext,
  ITreeItem,
  initResourceData,
  isError,
} from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { Box, Theme } from '@mui/material'
import { useRouter } from 'next/router'
import PageTitle from '../../atoms/PageTitle/PageTitle'
import PopIn from '../../atoms/modals/PopIn'

const CustomResourceForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: (theme as Theme).spacing(2),
}))
interface IProps {
  id?: string
  resourceName: string
  categoriesList?: ITreeItem[]
  title?: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { resourceName, id, categoriesList, title } = props
  const { t } = useTranslation('resourceForm')
  const resource = useResource(resourceName, IMainContext.FORM)
  const { replace, create, remove } = useResourceOperations<any>(resource)

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const requiredChamps = resource.supportedProperty.filter(
    (property) => property.required && property?.gally?.visible
  )

  const [data, setData] = useState<Record<string, unknown>>(
    id ? {} : initResourceData(resource)
  )

  const isValidForm = !requiredChamps.some((it) =>
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

  async function sendingData(): Promise<void> {
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
      enqueueSnackbar(
        sendingToApi?.error?.message ?? sendingToApi?.violations[0]?.message,
        {
          onShut: closeSnackbar,
          variant: 'error',
        }
      )
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
        <PageTitle title={title} sx={{ marginBottom: '32px' }}>
          {id ? (
            <PopIn
              onConfirm={deleteData}
              titlePopIn={t('confirmation.message.delete')}
              cancelName={t('cancel')}
              confirmName={t('confirm')}
              title={<Button loading={isLoading}>{t('delete')}</Button>}
              loading={isLoading}
            />
          ) : null}
        </PageTitle>
      ) : null}
      <CustomResourceForm>
        <CustomForm
          data={data}
          onChange={setData}
          resource={resource}
          categoriesList={categoriesList}
        />
        <Box>
          <Button
            disabled={!isValidForm}
            onClick={sendingData}
            loading={isLoading}
          >
            {id ? t('save') : t('create')}
          </Button>
        </Box>
      </CustomResourceForm>
    </>
  )
}

export default ResourceForm
