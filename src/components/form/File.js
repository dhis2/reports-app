import i18n from '@dhis2/d2-i18n'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import { Field } from 'react-final-form'
import { ErrorText } from './buildingBlocks/ErrorText.js'

const createChangeHandler = (input) => (event) => {
    event.persist()
    input.onChange({
        file: event.target.files[0],
        value: event.target.value,
    })
}

const formatBlobToString = (data) => (data ? data.value : '')

export const File = (props) => (
    <div>
        <Field
            name={props.name}
            type="file"
            placeholder={props.placeholder}
            format={formatBlobToString}
            {...props.fieldProps}
        >
            {({ input, meta, placeholder }) => (
                <FormControl>
                    <ErrorText
                        error={meta.error || ''}
                        touched={meta.touched}
                    />
                    <FormHelperText>{placeholder}</FormHelperText>
                    <FormHelperText>
                        <label htmlFor={input.name}>
                            <Button variant="contained" component="span">
                                {i18n.t('Select file')}
                            </Button>
                        </label>
                    </FormHelperText>
                    <input
                        name={input.name}
                        value={input.value}
                        onChange={createChangeHandler(input)}
                        id={input.name}
                        type="file"
                    />
                    <FormHelperText>
                        {input.value.replace('C:\\fakepath\\', '') ||
                            i18n.t('No file chosen')}
                    </FormHelperText>
                </FormControl>
            )}
        </Field>
        <style jsx>{`
            input {
                display: none;
            }
        `}</style>
    </div>
)

File.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    fieldProps: PropTypes.object,
}

File.defaultProps = {
    fieldProps: {},
}
