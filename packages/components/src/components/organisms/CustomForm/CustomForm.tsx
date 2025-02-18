import React from 'react'
import { useApiHeadersForm } from '../../../hooks'
import {
  IErrorsForm,
  IFieldConfigFormWithFieldset,
  IOption,
  IResource,
} from '@elastic-suite/gally-admin-shared'
import FormFieldGuesser from '../../stateful/FieldGuesser/FormFieldGuesser'
import Tooltip from '../../atoms/modals/Tooltip'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import {
  LabelFieldSet,
  ListItemForm,
  MainSectionFieldSet,
  SectionFieldSet,
} from './CustomForm.styled'
import { useTranslation } from 'next-i18next'

interface IProps {
  data?: Record<string, unknown>
  onChange: (val: Record<string, unknown>) => void
  resource: IResource
  errors?: IErrorsForm
  showAllErrors?: boolean
  externalFieldSet?: boolean
}

function CustomForm(props: IProps): JSX.Element {
  const {
    data,
    onChange,
    resource,
    errors,
    showAllErrors,
    externalFieldSet = false,
  } = props

  const headers = useApiHeadersForm(resource)
  const { t } = useTranslation('api')

  function handleChange(
    name: string | Record<string, string> | IOption<string>,
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
        if (
          (externalFieldSet && !fieldset.external) ||
          (!externalFieldSet && fieldset.external) ||
          fieldset.children.length === 0
        ) {
          return null
        }

        return (
          <SectionFieldSet
            key={fieldset?.position}
            data-testid={`${fieldset.code}FieldSet`}
          >
            {Boolean(fieldset.label) && (
              <LabelFieldSet>
                {t(fieldset.label)}
                {Boolean(fieldset.tooltip) && (
                  <Tooltip title={t(fieldset.tooltip) as string}>
                    <span style={{ display: 'inline-block' }}>
                      <IonIcon name="informationCircle" tooltip />
                    </span>
                  </Tooltip>
                )}
              </LabelFieldSet>
            )}
            <ListItemForm>
              {fieldset.children.map((field) => {
                return (
                  <FormFieldGuesser
                    key={field?.id}
                    field={field}
                    label={t(field?.label)}
                    infoTooltip={t(field?.infoTooltip)}
                    showError={showAllErrors}
                    onChange={handleChange}
                    editable
                    data={data}
                    placeholder={
                      field?.placeholder ? t(field?.placeholder) : undefined
                    }
                    helperText={errors?.fields?.[field?.name]}
                    error={Boolean(errors?.fields?.[field?.name])}
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
