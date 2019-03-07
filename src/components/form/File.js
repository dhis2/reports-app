import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import { identity } from '../../utils/boolean/identity'

const useFileBlobAsValue = input => event => {
    event.persist()
    input.onChange({
        file: event.target.files[0],
        value: event.target.value,
    })
}

export const File = props => (
    <div>
        <Field
            name={props.name}
            type="file"
            placeholder={props.placeholder}
            format={
                props.fileAsBlob ? data => (data ? data.value : '') : identity
            }
        >
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
                        name={input.name}
                        value={input.value}
                        onChange={
                            props.fileAsBlob
                                ? useFileBlobAsValue(input)
                                : input.onChange
                        }
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
    fileAsBlob: PropTypes.bool,
}

File.defaultProps = {
    fileAsBlob: false,
}
