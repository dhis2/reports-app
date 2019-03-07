import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'

export const File = props => (
    <div>
        <Field name={props.name} type="file" placeholder={props.placeholder}>
            {({ input, meta, placeholder }) => (
                <FormControl>
                    <FormHelperText>
                        {meta.error && meta.touched ? meta.error : ''}
                    </FormHelperText>
                    <FormHelperText>{placeholder}</FormHelperText>
                    <FormHelperText>
                        <label htmlFor={input.name}>
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                    </FormHelperText>
                    <input
                        {...input}
                        id={input.name}
                        type="file"
                        style={{ display: 'none' }}
                    />
                    <FormHelperText>
                        {input.value.replace('C:\\fakepath\\', '')}
                    </FormHelperText>
                </FormControl>
            )}
        </Field>
    </div>
)

File.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}
