import React, { useEffect, useState } from 'react'

import {
  useApiFetch,
  useLog,
  useResource,
  useResourceOperations,
} from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import { initResourceData, isError } from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { Box, Theme } from '@mui/material'

const CustomResourceForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: (theme as Theme).spacing(2),
}))
interface IProps {
  id?: string
  resourceName: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { t } = useTranslation('boost')
  const { resourceName, id } = props
  const resource = useResource(resourceName)

  const { update, create } = useResourceOperations<any>(resource)

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
      fetchApi<Record<string, unknown>>(`${resourceName}/${id}`).then(
        (json) => {
          if (isError(json)) {
            log(json.error)
          } else {
            setData(json)
          }
        }
      )
    }
  }, [id, fetchApi, log, resourceName])

  async function sendingData(): Promise<any> {
    setIsLoading(true)
    let sendingToApi
    if (id) {
      sendingToApi = await (update as any)(id, data)
    } else {
      sendingToApi = await (create as any)(data)
    }
    if (!isError(sendingToApi)) {
      enqueueSnackbar(t('alert'), {
        onShut: closeSnackbar,
        variant: 'success',
      })
    }
    setIsLoading(false)
  }

  return (
    <CustomResourceForm>
      <CustomForm data={data} onChange={setData} resource={resource} />
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
