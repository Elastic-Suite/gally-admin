import React, { useState } from 'react'

import { useResource, useResourceOperations } from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'
import Button from '../../atoms/buttons/Button'
import { isError } from '@elastic-suite/gally-admin-shared'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/system'
import { Box } from '@mui/material'

const CustomResourceForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))
interface IProps {
  resourceName: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { t } = useTranslation('categories')
  const { resourceName } = props
  const resource = useResource(resourceName)

  const { create } = useResourceOperations<any>(resource)

  const [isLoading, setIsLoading] = useState(false)
  const requiredFields = resource.supportedProperty.filter(
    (property) => property.required && property?.gally?.visible
  )

  const [data, setData] = useState<Record<string, unknown>>({})

  const isValidForm = !requiredFields.some((it) => !data?.[it.title as string])

  async function createForm(): Promise<any> {
    setIsLoading(true)
    const createForm = await (create as any)(data)
    if (isError(createForm)) {
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
          onClick={createForm}
          loading={isLoading}
        >
          Save
        </Button>
      </Box>
    </CustomResourceForm>
  )
}

export default ResourceForm
