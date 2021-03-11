import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import { children } from '../../utils/react/propTypes'

export const FormDialog = props => (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
        <div className="form-dialog-title">
            <DialogTitle>{props.title}</DialogTitle>
        </div>

        <div className="form-dialog-content">{props.children}</div>

        {/* 
            Make Dialog always have same width,
            instead of depending on childrens' width
        */}
        <style jsx>{`
            .form-dialog-title {
                border-bottom: 1px solid black;
            }

            .form-dialog-content {
                width: ${props.maxWidth}px;
                max-width: 100%;
                box-sizing: border-box;
                margin-left: 0;
                margin-right: 0;
            }
        `}</style>
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
