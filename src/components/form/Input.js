import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import { default as MUIInput } from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

export const Input = withStyles(styles)(props => (
    <div className={props.classes.container}>
        <Field name={props.name} placeholder={props.placeholder}>
            {({ input, meta, placeholder }) => (
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                    <MUIInput {...input} label={placeholder} />
                    <FormHelperText>
                        {meta.error && meta.touched ? meta.error : ''}
                    </FormHelperText>
                </FormControl>
            )}
        </Field>
    </div>
))

Input.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}
