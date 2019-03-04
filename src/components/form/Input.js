import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import { default as MUIInput } from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

export const Input = props => (
    <Field placeholder={props.placeholder}>
        {({ input, meta, placeholder }) => (
            <FormControl>
                <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                <MUIInput {...input} label={placeholder} />
                <FormHelperText>
                    {meta.error && meta.touched ? meta.error : ''}
                </FormHelperText>
            </FormControl>
        )}
    </Field>
)

Input.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}
