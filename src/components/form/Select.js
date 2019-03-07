import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { default as MUISelect } from '@material-ui/core/Select'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

export const Select = withStyles(styles)(props => (
    <div className={props.classes.container}>
        <Field name={props.name} placeholder={props.placeholder}>
            {({ input, meta, placeholder }) => (
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                    <MUISelect native {...input}>
                        {props.showEmptyOption && <option value="" />}
                        {props.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </MUISelect>
                    {props.showErrorText && (
                        <FormHelperText>
                            {meta.error && meta.touched ? meta.error : ''}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        </Field>
    </div>
))

Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    placeholder: PropTypes.string.isRequired,
    showEmptyOption: PropTypes.bool,
    showErrorText: PropTypes.bool,
}

Select.defaultProps = {
    showEmptyOption: false,
    showErrorText: false,
}
