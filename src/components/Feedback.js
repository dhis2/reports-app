import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core'
import styles from '../utils/styles'
import { clearFeedback } from '../redux/actions/feedback'

export const Feedback = ({
    showSnackbar,
    showLoader,
    message,
    type,
    action,
    onActionClick,
    onClose,
}) => {
    const conf = { message, type, action, onActionClick }
    return showLoader ? (
        <div style={styles.feedbackSnackBar}>
            <CircularProgress />
        </div>
    ) : (
        <span id="feedbackSnackbarId">
            <FeedbackSnackbar
                onClose={onClose}
                show={showSnackbar}
                conf={conf}
            />
        </span>
    )
}

Feedback.propTypes = {
    showSnackbar: PropTypes.bool.isRequired,
    showLoader: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    action: PropTypes.string,
    onActionClick: PropTypes.func,
}

Feedback.defaultProps = {
    action: '',
    onActionClick: () => null,
}

const mapStateToProps = ({ feedback }) => ({
    showSnackbar: feedback.showSnackbar,
    showLoader: feedback.showLoader,
    message: feedback.message,
    type: feedback.type,
})

const mapDispatchToProps = ({
    onClose: clearFeedback,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Feedback)
