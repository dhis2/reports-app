import { Button as D2UIButton } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Button.module.css'

export const Button = (props) => (
    <span className={styles.wrapper}>
        <D2UIButton
            raised
            type={props.type}
            onClick={props.onClick}
            color={props.isPrimary ? 'primary' : 'default'}
            disabled={props.disabled}
        >
            {props.label}
        </D2UIButton>
    </span>
)

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isPrimary: PropTypes.bool,
    type: PropTypes.string,
}

Button.defaultProps = {
    isPrimary: false,
    type: 'submit',
}
