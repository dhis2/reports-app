import { Button as ButtonOrig } from '@dhis2/d2-ui-core'
import React from 'react'
import PropTypes from 'prop-types'
import css from 'styled-jsx/css'

const style = css`
    span {
        display: inline-block;
        margin-right: 10px;
    }
`

export const Button = props => (
    <span>
        <ButtonOrig
            raised
            type={props.type}
            onClick={props.onClick}
            color={props.isPrimary ? 'primary' : 'default'}
        >
            {props.label}
        </ButtonOrig>
        <style jsx>{style}</style>
    </span>
)

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isPrimary: PropTypes.bool,
    type: PropTypes.string,
}

Button.defaultProps = {
    isPrimary: false,
    type: 'submit',
}