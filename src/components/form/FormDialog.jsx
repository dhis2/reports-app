import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import { children } from '../../utils/react/propTypes.js'
import styles from './FormDialog.module.css'

export const FormDialog = (props) => (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
        <div className={styles.formDialogTitle}>
            <DialogTitle>{props.title}</DialogTitle>
        </div>

        <div
            className={styles.formDialogContent}
            style={{ width: `${props.maxWidth}px` }}
        >
            {props.children}
        </div>
    </Dialog>
)

FormDialog.propTypes = {
    children: children.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    maxWidth: PropTypes.number,
}

FormDialog.defaultProps = {
    maxWidth: 600,
}
