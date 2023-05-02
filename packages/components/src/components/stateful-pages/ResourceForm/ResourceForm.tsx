import React from 'react'

import { useResource, useResourceOperations } from '../../../hooks'

import CustomForm from '../../organisms/CustomForm/CustomForm'

interface IProps {
  // id?: string
  resourceName: string
}

function ResourceForm(props: IProps): JSX.Element {
  const { resourceName } = props
  const resource = useResource(resourceName)
  const { create } = useResourceOperations(resource)

  return (
    <CustomForm
      data={{}}
      onChange={(...args): void => console.log(...args)}
      resource={resource}
    />
  )
}

export default ResourceForm
