import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

export const CheckBoxes = props => (
    <FormControl style={{ margin: '0 0 20px' }}>
        {props.label && (
            <FormHelperText
                style={{
                    margin: '0 0 10px',
                    fontSize: '1rem',
                    color: 'black',
                }}
            >
                {props.label}
            </FormHelperText>
        )}
        {props.showError && (
            <Field name={props.name} type="checkbox">
                {({ meta }) => (meta.error && meta.touched ? meta.error : '')}
            </Field>
        )}
        {props.options.map(option => (
            <div key={option.label}>
                <Field
                    type="checkbox"
                    component="input"
                    value={option.value}
                    name={props.name}
                />
                {option.label}
            </div>
        ))}
    </FormControl>
)

CheckBoxes.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string,
    showError: PropTypes.bool,
}

CheckBoxes.defaultProps = {
    label: '',
    showError: true,
}
