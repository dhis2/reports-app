import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React from 'react'
import { Field } from 'react-final-form'
import { RadioButton } from './RadioButton'

const styles = {
    container: {
        margin: '0',
    },
    label: {
        margin: '0 0 10px',
        fontSize: '1rem',
        color: 'black',
    },
}

export const RadioButtons = withStyles(styles)((props) => (
    <FormControl className={props.classes.container}>
        {props.label && (
            <FormHelperText className={props.classes.label}>
                {props.label}
            </FormHelperText>
        )}
        {props.showError && (
            <Field name={props.name} type="checkbox">
                {({ meta }) => (meta.error && meta.touched ? meta.error : '')}
            </Field>
        )}
        {props.options.map((option) => (
            <div key={option.label}>
                <Field
                    type="radio"
                    value={option.value}
                    label={option.label}
                    component={RadioButton}
                    name={props.name}
                />
            </div>
        ))}
    </FormControl>
))

RadioButtons.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string,
    showError: PropTypes.bool,
}

RadioButtons.defaultProps = {
    label: '',
    showError: true,
}
