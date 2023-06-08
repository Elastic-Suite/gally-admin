import React from 'react'
import { useApiHeadersForm } from '../../../hooks'
import {
  IFieldConfigFormWithFieldset,
  IResource,
  ITreeItem,
} from '@elastic-suite/gally-admin-shared'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import Tooltip from '../../atoms/modals/Tooltip'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import {
  LabelFieldSet,
  ListItemForm,
  MainSectionFieldSet,
  SectionFieldSet,
} from './CustomForm.styled'
import { getValue } from '../../../services'

interface IProps {
  data?: Record<string, unknown>
  onChange: (val: Record<string, unknown>) => void
  resource: IResource
  categoriesList?: ITreeItem[]
}

function CustomForm(props: IProps): JSX.Element {
  const { data, onChange, resource, categoriesList } = props

  const headers = useApiHeadersForm(resource)

  function handleChange(
    name: string | Record<string, string>,
    response: unknown
  ): void {
    if (response instanceof Array || typeof response !== 'object') {
      return onChange({ ...data, [name as string]: response })
    }
    return onChange({ ...data, ...response })
  }

  return (
    <MainSectionFieldSet>
      {headers.map((fieldset: IFieldConfigFormWithFieldset) => {
        if (fieldset.children.length === 0) {
          return null
        }

        return (
          <SectionFieldSet key={fieldset?.position}>
            {Boolean(fieldset.label) && (
              <LabelFieldSet>
                {fieldset.label}
                {Boolean(fieldset.tooltip) && (
                  <Tooltip title={fieldset.tooltip as string}>
                    <span style={{ display: 'inline-block' }}>
                      <IonIcon name="informationCircle" tooltip />
                    </span>
                  </Tooltip>
                )}
              </LabelFieldSet>
            )}
            <ListItemForm>
              {fieldset.children.map((field) => {
                if (field?.label.endsWith('Limitations')) {
                  return null
                }

                return (
                  <FieldGuesser
                    key={field?.id}
                    {...field}
                    onChange={handleChange}
                    value={getValue(field, data)}
                    categoriesList={categoriesList}
                    editable
                    data={data}
                  />
                )
              })}
            </ListItemForm>
          </SectionFieldSet>
        )
      })}
    </MainSectionFieldSet>
  )
}

export default CustomForm
