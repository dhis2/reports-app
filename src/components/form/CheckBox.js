import React from 'react'
import PropTypes from 'prop-types'
import { formInput } from '../../utils/react/propTypes'

export const CheckBox = props => (
    <div className="form-checkbox">
        <div className="input-container">
            <input
                id={props.input.name + props.input.value}
                {...props.input}
                type="checkbox"
            />
        </div>

        <label
            className="label-container"
            htmlFor={props.input.name + props.input.value}
        >
            {props.label}
        </label>

        <style jsx>{`
            .form-checkbox {
                align-items: center;
                display: flex;
                height: 30px;
                width: 100%;
            }

            .input-container {
                width: 20px;
            }

            input {
                display: block;
                margin: 0;
            }

            label {
                display: block;
                flex-grow: 1;
            }
        `}</style>
    </div>
)

CheckBox.propTypes = {
    label: PropTypes.string.isRequired,
    input: formInput.isRequired,
}