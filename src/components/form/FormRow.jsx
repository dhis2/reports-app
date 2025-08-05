import React from 'react'
import { children } from '../../utils/react/propTypes.js'
import styles from './FormRow.module.css'

export const FormRow = (props) => (
    <div className={styles.formRow}>{props.children}</div>
)

FormRow.propTypes = {
    children: children.isRequired,
}
