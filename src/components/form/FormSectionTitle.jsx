import React from 'react'
import { children } from '../../utils/react/propTypes.js'
import styles from './FormSectionTitle.module.css'

export const FormSectionTitle = ({ children }) => (
    <h2 className={styles.title}>{children}</h2>
)

FormSectionTitle.propTypes = {
    children: children.isRequired,
}
