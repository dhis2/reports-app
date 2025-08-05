import PropTypes from 'prop-types'
import React from 'react'
import { children } from '../../utils/react/propTypes.js'
import styles from './FormSection.module.css'

export const FormSection = ({ show, render, children }) => {
    if (!show) {
        return null
    }

    return (
        <section className={styles.formSection}>{children || render()}</section>
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
