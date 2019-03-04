import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'

export const File = props => (
    <Field placeholder={props.placeholder}>
        {({ input, meta, placeholder }) => (
            <FormControl>
                <InputLabel htmlFor={input.name}>{placeholder}</InputLabel>
                <FormHelperText>{input.name}</FormHelperText>
                <input {...input} type="file" style={{ display: 'none' }} />
                <label htmlFor={input.name}>
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>
                <FormHelperText>
                    {meta.error && meta.touched ? meta.error : ''}
                </FormHelperText>
            </FormControl>
        )}
    </Field>
)

File.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}
