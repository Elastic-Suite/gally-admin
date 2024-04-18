import React, {
  ForwardedRef,
  ReactNode,
  SyntheticEvent,
  forwardRef,
} from 'react'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  TextareaAutosize,
} from '@mui/material'
import classNames from 'classnames'
import { TextareaAutosizeProps } from '@mui/base/TextareaAutosize/TextareaAutosize'
import IonIcon from '../IonIcon/IonIcon'

//Example get here https://codesandbox.io/s/n4t82?file=/src/index.js:612-654
export interface ITextareaProps
  extends Omit<TextareaAutosizeProps, 'onChange'> {
  error?: boolean
  fullWidth?: boolean
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  resizable?: boolean
  onChange?: (value: string, event: SyntheticEvent) => void
  helperText?: ReactNode
  helperIcon?: string
}

function Textarea(
  props: ITextareaProps,
  ref?: ForwardedRef<HTMLTextAreaElement>
): JSX.Element {
  const {
    error,
    fullWidth,
    id,
    label,
    margin,
    maxLength,
    required,
    resizable,
    value,
    helperText,
    helperIcon,
    onChange,
    ...other
  } = props
  const maxLengthValue = maxLength ?? 250
  const valueString = String(value ?? '')
  return (
    <FormControl fullWidth={fullWidth} margin={margin} variant="standard">
      {label ? (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
        </InputLabel>
      ) : null}
      <TextareaAutosize
        {...other}
        id={id}
        required={required}
        maxLength={maxLengthValue}
        style={{
          height: 150,
          minWidth: 320,
          resize: resizable ? 'both' : 'none',
        }}
        className={classNames({
          'textarea--filled': valueString.length > 0,
          'textarea--error': error,
        })}
        value={valueString}
        onChange={(event): void => {
          onChange(event.target.value, event)
        }}
        ref={ref}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: helperText ? 'space-between' : 'flex-end',
        }}
      >
        {Boolean(helperText) && (
          <FormHelperText error={error}>
            {Boolean(helperIcon) && (
              <IonIcon
                name={helperIcon}
                style={{ fontSize: 18, marginRight: 2 }}
              />
            )}
            {helperText}
          </FormHelperText>
        )}
        <FormHelperText style={{ display: 'block', textAlign: 'right' }}>
          {`${valueString.length}/${maxLengthValue}`}
        </FormHelperText>
      </div>
    </FormControl>
  )
}

export default forwardRef<HTMLTextAreaElement, ITextareaProps>(Textarea)
