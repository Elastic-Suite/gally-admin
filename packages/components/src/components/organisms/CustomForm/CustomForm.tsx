import React from 'react'
import boostJsLd from '../../../../public/mocks/boostJsLd.json'
import {
  useApiDoubleDatePicker,
  useApiHeadersForm,
  useResource,
} from '../../../hooks'
import {
  IDependsForm,
  IFieldConfig,
  IFieldConfigFormWithFieldset,
  IResource,
} from '@elastic-suite/gally-admin-shared'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import Tooltip from '../../atoms/modals/Tooltip'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import {
  MainSectionFieldSet,
  MainSection,
  SectionFieldSet,
  ListItemForm,
  LabelFieldSet,
} from './CustomForm.styled'
import { getDoubleDatePickerValue, isHiddenDepends } from '../../../services'

interface IProps {
  data: Record<string, unknown> | undefined
  handleChange: (val: string, response: any) => void
  resourceName: string
}

function CustomForm(props: IProps): JSX.Element {
  const { data, handleChange, resourceName } = props

  const resource = boostJsLd as IResource
  // const resource = useResource(ressourceName)

  const concatMultiDatePicker = useApiDoubleDatePicker(resource)
  const headers = useApiHeadersForm(concatMultiDatePicker)

  const Root = (headers as unknown[]).find(
    (it) => (it as IFieldConfigFormWithFieldset)?.children
  )
    ? MainSectionFieldSet
    : MainSection

  return (
    <Root>
      {headers.map((item: IFieldConfig | IFieldConfigFormWithFieldset) => {
        if ((item as IFieldConfigFormWithFieldset)?.children) {
          return (
            <SectionFieldSet>
              {item.label && (
                <LabelFieldSet>
                  {item.label}
                  {(item as IFieldConfigFormWithFieldset).tooltip && (
                    <Tooltip
                      title={
                        (item as IFieldConfigFormWithFieldset).tooltip as string
                      }
                    >
                      <span style={{ display: 'inline-block' }}>
                        <IonIcon name="informationCircle" tooltip />
                      </span>
                    </Tooltip>
                  )}
                </LabelFieldSet>
              )}
              <ListItemForm>
                {(item as IFieldConfigFormWithFieldset).children.map((it) => {
                  const dependsForm = it?.field?.gally?.form?.depends
                  if (dependsForm) {
                    const isHidden = isHiddenDepends(
                      dependsForm as IDependsForm[],
                      data
                    )

                    if (isHidden) {
                      return null
                    }
                  }

                  const val =
                    it?.input === 'rangeDate'
                      ? getDoubleDatePickerValue(
                          data as Record<string, unknown>
                        )
                      : data?.[it.name]
                  return (
                    <div>
                      <FieldGuesser
                        {...it}
                        onChange={handleChange}
                        value={val}
                        editable
                      />
                    </div>
                  )
                })}
              </ListItemForm>
            </SectionFieldSet>
          )
        }

        const dependsForm = (item as IFieldConfig)?.field?.gally?.form?.depends
        if (dependsForm) {
          const isHidden = isHiddenDepends(dependsForm as IDependsForm[], data)

          if (isHidden) {
            return null
          }
        }

        const val =
          (item as IFieldConfig)?.input === 'rangeDate'
            ? getDoubleDatePickerValue(data as Record<string, unknown>)
            : data?.[(item as IFieldConfig)?.name]
        return (
          <div>
            <FieldGuesser
              {...(item as IFieldConfig)}
              onChange={handleChange}
              value={val}
              editable
            />
          </div>
        )
      })}
    </Root>
  )
}

export default CustomForm
