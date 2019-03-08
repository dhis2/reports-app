import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const styles = {
    container: {
        margin: '0 0 20px',
    },
    label: {
        margin: '0 0 10px',
        fontSize: '1rem',
        color: 'black',
    },
}

export const CheckBoxes = withStyles(styles)(props => (
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
))

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
