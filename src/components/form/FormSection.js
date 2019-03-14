import React from 'react'
import PropTypes from 'prop-types'
import { children } from '../../utils/react/propTypes'

export const FormSection = ({ show, render, children }) => {
    if (!show) return null

    return (
        <section>
            {children || render()}
            <style jsx>{`
                section {
                    margin: 0 0 10px;
                }
            `}</style>
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
