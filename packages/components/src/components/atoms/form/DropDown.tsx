import React, {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useMemo,
  useRef,
} from 'react'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FormControl,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { IOption, IOptions } from '@elastic-suite/gally-admin-shared'

import Checkbox from './Checkbox'
import { SmallStyledPaper, StyledPaper } from './DropDown.styled'
import InputText, { IInputTextProps } from './InputText'

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
}

function DropDown<T>(props: IDropDownProps<T>): JSX.Element {
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
    ...otherProps
  } = props
  const { required, small } = otherProps
  const { t } = useTranslation('common')
  const inputRef = useRef()
  const optionMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )

  const optionValue =
    value instanceof Array
      ? value.map((val: any) => {
          return objectKeyValue
            ? optionMap.get(val[objectKeyValue])
            : optionMap.get(val)
        })
      : value instanceof Object
      ? optionMap.get(value[objectKeyValue as keyof object] as T) ?? null
      : optionMap.get(value as T) ?? null

  function handleChange(
    event: SyntheticEvent,
    option: IOption<T> | IOption<T>[]
  ): void {
    const dropdownEvent = { ...event, target: inputRef.current }
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
        <li {...props}>
          <Checkbox checked={selected} label={label} list />
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
            {...getTagProps({ index })}
          />
        ))
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
        popupIcon={<IonIcon name="chevron-down" />}
        renderInput={(params): JSX.Element => {
          const { InputLabelProps, InputProps, ...inputProps } = params
          return (
            <InputText
              {...otherProps}
              {...inputProps}
              {...InputProps}
              fullWidth={fullWidth}
              inputRef={inputRef}
            />
          )
        }}
        renderOption={renderOption}
        renderTags={renderTags}
        style={style}
        value={optionValue}
      />
    </FormControl>
  )
}

export default DropDown
