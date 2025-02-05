import React, {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  RefObject,
  SyntheticEvent,
  forwardRef,
  useMemo,
  useRef,
} from 'react'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FormControl,
  ListItem,
  ListSubheader,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { IOption, IOptions } from '@elastic-suite/gally-admin-shared'

import CheckboxWithoutError from './CheckboxWithoutError'
import { SmallStyledPaper, StyledPaper } from './DropDown.styled'
import InputTextWithoutError, { IInputTextProps } from './InputTextWithoutError'

import IonIcon from '../IonIcon/IonIcon'
import Chip from '../Chip/Chip'

export interface IDropDownProps<T>
  extends Omit<IInputTextProps, 'onChange' | 'value'> {
  disabled?: boolean
  limitTags?: number
  multiple?: boolean
  onChange?: (value: T | T[], event: SyntheticEvent) => void
  options: IOptions<T>
  style?: CSSProperties
  value?: T | T[] | object | object[]
  useGroups?: boolean
  objectKeyValue?: string
  dataTestId?: string
}

function DropDownWithoutError<T>(
  props: IDropDownProps<T>,
  ref?: RefObject<HTMLInputElement>
): JSX.Element {
  const {
    disabled,
    fullWidth,
    limitTags,
    multiple,
    onChange,
    options,
    style,
    value,
    useGroups,
    objectKeyValue,
    dataTestId,
    ...otherProps
  } = props
  const { required, small } = otherProps
  const { t } = useTranslation('common')
  const inputRef = useRef(null)
  const optionMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )

  const optionValue =
    value instanceof Array
      ? value.map((val: T | object) => {
          return typeof val === 'object'
            ? optionMap.get(val[objectKeyValue as keyof object] as T)
            : optionMap.get(val)
        })
      : value instanceof Object && objectKeyValue
      ? optionMap.get(value[objectKeyValue as keyof object] as T) ?? null
      : optionMap.get(value as T) ?? null

  function handleChange(
    event: SyntheticEvent,
    option: IOption<T> | IOption<T>[]
  ): void {
    const dropdownEvent = { ...event, target: (ref || inputRef).current }
    setTimeout(() => {
      if (!option && !required) {
        onChange(null, dropdownEvent)
      } else if (option instanceof Array) {
        onChange(
          option.map(({ value }) =>
            objectKeyValue ? ({ [objectKeyValue]: value } as T) : value
          ),
          dropdownEvent
        )
      } else if (option) {
        onChange(
          objectKeyValue
            ? ({ [objectKeyValue]: option.value } as T)
            : option.value,
          dropdownEvent
        )
      }
    }, 0)
  }

  const clearText = t('form.clear')
  const closeText = t('form.close')
  const openText = t('form.open')

  let renderOption
  let renderTags
  if (multiple) {
    // eslint-disable-next-line react/no-unstable-nested-components, react/function-component-definition, react/display-name
    renderOption = (
      props: HTMLAttributes<HTMLLIElement>,
      { label }: IOption<T>,
      { selected }: AutocompleteRenderOptionState
    ): ReactNode => {
      return (
        <li
          {...props}
          data-testid={dataTestId ? `${dataTestId}DropdownOption` : null}
        >
          <CheckboxWithoutError
            checked={selected}
            label={label}
            list
            onClick={(e): void => e.preventDefault()}
            dataTestId={dataTestId ? `${dataTestId}Checkbox` : null}
          />
        </li>
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderTags = (value: IOption<T>[], getTagProps: any): ReactNode[] =>
      value
        .filter((option) => option)
        .map((option: IOption<T>, index: number) => (
          <Chip
            key={option.id ?? String(option.value)}
            label={option.label}
            size={small ? 'small' : 'medium'}
            data-testid={dataTestId ? `${dataTestId}Tag` : null}
            {...getTagProps({ index })}
          />
        ))
  } else {
    renderOption = (
      props: HTMLAttributes<HTMLLIElement>,
      option: IOption<T>
    ): ReactNode => {
      return (
        <ListItem
          {...props}
          data-testid={dataTestId ? `${dataTestId}DropdownOption` : null}
        >
          {option.label}
        </ListItem>
      )
    }
  }

  return (
    <FormControl fullWidth={fullWidth} variant="standard">
      <Autocomplete
        PaperComponent={small ? SmallStyledPaper : StyledPaper}
        clearIcon={<IonIcon name="close" />}
        clearText={clearText}
        closeText={closeText}
        componentsProps={{ popper: { placement: 'bottom-start' } }}
        disableClearable={required}
        disableCloseOnSelect={multiple}
        disabled={disabled}
        getOptionDisabled={(option: IOption<T>): boolean => option.disabled}
        limitTags={limitTags}
        multiple={multiple}
        onChange={handleChange}
        openText={openText}
        options={options}
        groupBy={
          useGroups
            ? (option: IOption<T>): string => {
                return option.id as string
              }
            : undefined
        }
        getOptionLabel={
          useGroups ? (options: IOption<T>): string => options.label : undefined
        }
        popupIcon={
          <IonIcon
            data-testid={dataTestId ? `${dataTestId}Button` : null}
            name="chevron-down"
          />
        }
        renderGroup={(params): JSX.Element => (
          <li key={params.key}>
            <ListSubheader
              data-testid={dataTestId ? `${dataTestId}GroupTitle` : null}
            >
              {params.group}
            </ListSubheader>
            <ul style={{ padding: 0 }}>{params.children}</ul>
          </li>
        )}
        renderInput={(params): JSX.Element => {
          const { InputLabelProps, InputProps, ...inputProps } = params

          return (
            <InputTextWithoutError
              {...{ ...otherProps, required: false }}
              {...inputProps}
              {...InputProps}
              fullWidth={fullWidth}
              inputRef={ref || inputRef}
              requiredLabel={required}
              dataTestId={dataTestId ? `${dataTestId}InputText` : null}
            />
          )
        }}
        renderOption={renderOption}
        renderTags={renderTags}
        style={{ width: 'fit-content', ...style }}
        value={optionValue}
        selectOnFocus={false}
        data-testid={dataTestId}
      />
    </FormControl>
  )
}

export default forwardRef(DropDownWithoutError)
