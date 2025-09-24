import PropTypes from 'prop-types'
import React from 'react'
import { formInput } from '../../utils/react/propTypes.js'
import styles from './RadioButton.module.css'

export const RadioButton = (props) => (
    <div className={styles.formCheckbox}>
        <div className={styles.inputContainer}>
            <input
                id={props.input.name + props.input.value}
                {...props.input}
                type="radio"
            />
        </div>

        <label
            className={styles.labelContainer}
            htmlFor={props.input.name + props.input.value}
        >
            {props.label}
        </label>
    </div>
)

RadioButton.propTypes = {
    input: formInput.isRequired,
    label: PropTypes.string.isRequired,
}
