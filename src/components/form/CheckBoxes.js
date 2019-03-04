import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

export const CheckBoxes = props => (
    <FormControl>
        <FormHelperText>{props.label}</FormHelperText>
        {props.options.map(option => (
            <div>
                <Field
                    name={props.name}
                    type="checkbox"
                    value={option.value}
                    component="input"
                />{' '}
                {option.label}
            </div>
        ))}
    </FormControl>
)

CheckBoxes.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
}
