import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

export const Select = props => (
    <Field placeholder={props.placeholder}>
        {({ input, meta, placeholder }) => (
            <FormControl>
                <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                <Select {...input}>
                    {props.options.map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                    {meta.error && meta.touched ? meta.error : ''}
                </FormHelperText>
            </FormControl>
        )}
    </Field>
)

Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    placeholder: PropTypes.string.isRequired,
}
