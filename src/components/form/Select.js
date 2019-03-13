import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { default as MUISelect } from '@material-ui/core/Select'
import {
    formInput,
    formInputMeta,
    formOptions,
} from '../../utils/react/propTypes'
import { inputWrapper } from './styles'
import { ErrorText } from './buildingBlocks/ErrorText'

export const SelectField = props => (
    <MUISelect native {...props.input} disabled={props.disabled}>
        {props.showEmptyOption && <option value="" />}
        {props.options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </MUISelect>
)

SelectField.propTypes = {
    input: formInput.isRequired,
    showEmptyOption: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    options: formOptions.isRequired,
}

const { className, styles } = inputWrapper
export const Select = props => (
    <FormControl className={className}>
        <InputLabel htmlFor={props.input.name}>{props.placeholder}</InputLabel>
        <SelectField
            input={props.input}
            showEmptyOption={props.showEmptyOption}
            options={props.options}
            disabled={props.disabled}
        />
        <ErrorText
            showErrorText={props.showErrorText}
            error={props.meta.error || ''}
            touched={props.meta.touched}
        />
        {styles}
    </FormControl>
)

Select.propTypes = {
    input: formInput.isRequired,
    meta: formInputMeta.isRequired,
    placeholder: PropTypes.string.isRequired,
    options: formOptions.isRequired,

    showEmptyOption: PropTypes.bool,
    showErrorText: PropTypes.bool,
    disabled: PropTypes.bool,
}

Select.defaultProps = {
    showEmptyOption: false,
    showErrorText: false,
    disabled: false,
}
