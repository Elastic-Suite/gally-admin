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

const CustomResourceForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: (theme as Theme).spacing(2),
}))
interface IProps {
  id?: string
  resourceName: string
  categoriesList?: ITreeItem[]
}

function ResourceForm(props: IProps): JSX.Element {
  const { resourceName, id, categoriesList } = props
  const { t } = useTranslation('resourceForm')
  const resource = useResource(resourceName, IMainContext.FORM)
  const { replace, create } = useResourceOperations<any>(resource)

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const requiredChamps = resource.supportedProperty.filter(
    (property) => property.required && property?.gally?.visible
  )

  const [data, setData] = useState<Record<string, unknown>>(
    id ? {} : initResourceData(resource)
  )

  const isValidForm = !requiredChamps.some((it) => !data?.[it.title as string])

  const fetchApi = useApiFetch()
  const log = useLog()

  useEffect(() => {
    if (id) {
      fetchApi<Record<string, unknown>>(`${resource.url}/${id}`).then(
        (json) => {
          if (isError(json)) {
            log(json.error)
          } else {
            setData(json)
          }
        }
      )
    }
  }, [id, fetchApi, log, resource.url])

  async function sendingData(): Promise<any> {
    setIsLoading(true)
    let sendingToApi
    if (id) {
      sendingToApi = await (replace as any)(data)
      setData(sendingToApi)
    } else {
      sendingToApi = await (create as any)(data)
    }
    if (!isError(sendingToApi)) {
      enqueueSnackbar(id ? t('alert.update') : t('alert.create'), {
        onShut: closeSnackbar,
        variant: 'success',
      })
      if (!id) {
        return router.push('./grid')
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

  return (
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
  )
}

export default ResourceForm
