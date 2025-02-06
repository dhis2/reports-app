import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import MUISelect from '@material-ui/core/Select'
import PropTypes from 'prop-types'
import React from 'react'
import {
    formInput,
    formInputMeta,
    formOptions,
} from '../../utils/react/propTypes.js'
import { ErrorText } from './buildingBlocks/ErrorText.jsx'
import { inputWrapper } from './styles.js'

export const SelectField = (props) => (
    <MUISelect {...props.input} disabled={props.disabled}>
        {props.showEmptyOption && <MenuItem value="" />}
        {props.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </MUISelect>
)

SelectField.propTypes = {
    disabled: PropTypes.bool.isRequired,
    input: formInput.isRequired,
    options: formOptions.isRequired,
    showEmptyOption: PropTypes.bool.isRequired,
}

const { className, styles } = inputWrapper
export const Select = (props) => (
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
    options: formOptions.isRequired,
    placeholder: PropTypes.string.isRequired,

    disabled: PropTypes.bool,
    showEmptyOption: PropTypes.bool,
    showErrorText: PropTypes.bool,
}

Select.defaultProps = {
    showEmptyOption: false,
    showErrorText: false,
    disabled: false,
}
