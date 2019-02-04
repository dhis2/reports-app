import React from 'react'
import PropTypes from 'prop-types'
import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core'
import { LOADING } from '../utils/feedbackSnackBarTypes'
import styles from '../utils/styles'

const Feedback = ({ open, conf, onClose }) =>
    conf.type === LOADING ? (
        <div style={styles.feedbackSnackBar}>
            <CircularProgress />
        </div>
    ) : (
        <span id="feedbackSnackbarId">
            <FeedbackSnackbar onClose={onClose} show={open} conf={conf} />
        </span>
    )

Feedback.propTypes = {
    open: PropTypes.bool.isRequired,
    conf: PropTypes.object.isRequired,
    onClose: PropTypes.func,
}

Feedback.defaultProps = {
    onClose: () => undefined,
}

export default Feedback
