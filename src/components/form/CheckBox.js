import Checkbox from '@material-ui/core/Checkbox'
import PropTypes from 'prop-types'
import React from 'react'
import { resolve } from 'styled-jsx/css'
import { formInput } from '../../utils/react/propTypes.js'

const checkboxStyle = resolve`
    span {
        width: 20px;
        height: 20px;
        padding: 0;
    }
`

export const CheckBox = (props) => (
    <div className="form-checkbox">
        <div className="input-container">
            <Checkbox
                id={props.input.name + props.input.value}
                {...props.input}
                type="checkbox"
                className={checkboxStyle.className}
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
                align-items: flex-start;
                display: flex;
                min-height: 30px;
                width: 100%;
            }

            .input-container {
                width: 25px;
                flex-shrink: 0;
            }

            input {
                display: block;
                margin: 0;
            }

            label {
                display: block;
                flex-grow: 1;
                padding: 2px 0 5px;
            }
        `}</style>
        {checkboxStyle.styles}
    </div>
)

CheckBox.propTypes = {
    input: formInput.isRequired,
    label: PropTypes.string.isRequired,
}
