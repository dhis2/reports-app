import React from 'react'
import PropTypes from 'prop-types'
import css from 'styled-jsx/css'

import { children } from '../../utils/react/propTypes'

const style = css`
    section {
        margin: 0 0 10px;
    }
`

export const FormSection = ({ show, render, children }) => {
    if (!show) return null

    return (
        <section>
            {children || render()}
            <style jsx>{style}</style>
        </section>
    )
}

FormSection.propTypes = {
    children,
    render: PropTypes.func,
    show: PropTypes.bool,
}

FormSection.defaultProps = {
    children: null,
    render: () => null,
    show: true,
}
