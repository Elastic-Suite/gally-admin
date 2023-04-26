import React, { SyntheticEvent } from 'react'
import { useApiHeaders } from '../../../hooks'
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
  onChange: (val: Record<string, unknown> | undefined) => void
  resource: IResource
}

function CustomForm(props: IProps): JSX.Element {
  const { data, onChange, resource } = props

  const headers = useApiHeaders(resource)

  const Root = (headers as unknown[]).find(
    (it) => (it as IFieldConfigFormWithFieldset)?.children
  )
    ? MainSectionFieldSet
    : MainSection

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
    <Root>
      {headers.map((item: IFieldConfig | IFieldConfigFormWithFieldset) => {
        if ((item as IFieldConfigFormWithFieldset)?.children) {
          return (
            <SectionFieldSet
              key={(item as IFieldConfigFormWithFieldset)?.position}
            >
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
                    <FieldGuesser
                      key={it?.id}
                      {...it}
                      onChange={handleChange}
                      value={val}
                      editable
                    />
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
          <FieldGuesser
            key={(item as IFieldConfig)?.id}
            {...(item as IFieldConfig)}
            onChange={handleChange}
            value={val}
            editable
          />
        )
      })}
    </Root>
  )
}

export default CustomForm
