import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { default as MUISelect } from '@material-ui/core/Select'
import { withStyles } from '@material-ui/core/styles'
import { formInput, formOptions } from '../../utils/react/propTypes'
import { styles } from './styles'
import { ErrorText } from './buildingBlocks/ErrorText'

export const SelectField = props => (
    <MUISelect native {...props.input}>
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
    options: formOptions.isRequired,
}

export const Select = props => (
    <FormControl className={props.classes.formControl}>
        <InputLabel htmlFor={props.input.name}>{props.placeholder}</InputLabel>
        <SelectField
            input={props.input}
            showEmptyOption={props.showEmptyOption}
            options={props.options}
        />
        <ErrorText
            showErrorText={props.showErrorText}
            error={props.error}
            touched={props.touched}
        />
    </FormControl>
)

Select.propTypes = {
    classes: PropTypes.shape({
        formControl: PropTypes.string.isRequired,
        container: PropTypes.string.isRequired,
    }).isRequired,
    placeholder: PropTypes.string.isRequired,
    input: formInput.isRequired,
    showEmptyOption: PropTypes.bool.isRequired,
    showErrorText: PropTypes.bool.isRequired,
    options: formOptions.isRequired,
    error: PropTypes.string.isRequired,
    touched: PropTypes.bool.isRequired,
}

Select.defaultProps = {
    showEmptyOption: false,
    showErrorText: false,
}

export default withStyles(styles)(Select)
