import React from 'react'
import { useApiHeadersForm } from '../../../hooks'
import {
  IFieldConfigFormWithFieldset,
  IResource,
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
import { getRequestTypeData } from '../../../services'

interface IProps {
  data?: Record<string, unknown>
  onChange: (val: Record<string, unknown>) => void
  resource: IResource
}

function CustomForm(props: IProps): JSX.Element {
  const { data, onChange, resource } = props

  const headers = useApiHeadersForm(resource)

  function handleChange(
    name: string | Record<string, string>,
    response: unknown
  ): void {
    if (typeof response === 'object') {
      return onChange({ ...data, ...response })
    }
    return onChange({ ...data, [name as string]: response })
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
                // const dependsForm = it?.field?.gally?.form?.depends
                // if (dependsForm) {
                //   const isHidden = isHiddenDepends(
                //     dependsForm as IDependsForm[],
                //     data
                //   )

                //   if (isHidden) {
                //     return null
                //   }
                // }

                if (field?.label.endsWith('Limitations')) {
                  return null
                }

                let val
                switch (field?.input) {
                  case 'requestType':
                    val = getRequestTypeData(data)
                    break

                  // case 'rangeDate':
                  //   val = getDoubleDatePickerValue(
                  //     data as Record<string, unknown>
                  //   )
                  //   break

                  default:
                    val = data?.[field.name]
                    break
                }

                return (
                  <FieldGuesser
                    key={field?.id}
                    {...field}
                    onChange={handleChange}
                    value={val}
                    editable
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
