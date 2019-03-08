import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import { default as MUIInput } from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'
import { ErrorText } from './buildingBlocks/ErrorText'

export const Input = withStyles(styles)(props => (
    <div className={props.classes.container}>
        <Field name={props.name} placeholder={props.placeholder}>
            {({ input, meta, placeholder }) => (
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                    <MUIInput {...input} label={placeholder} />
                    <ErrorText
                        error={meta.error || ''}
                        touched={meta.touched}
                    />
                </FormControl>
            )}
        </Field>
    </div>
))

Input.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}
