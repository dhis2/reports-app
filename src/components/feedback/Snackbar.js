import { FeedbackSnackbar } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { clearFeedback } from '../../redux/actions/feedback'

const Snackbar = ({
    showSnackbar,
    message,
    type,
    action,
    onActionClick,
    onClose,
}) => {
    const conf = { message, type, action, onActionClick }
    return (
        <span id="feedbackSnackbarId">
            <FeedbackSnackbar
                onClose={onClose}
                show={showSnackbar}
                conf={conf}
            />
        </span>
    )
}

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    showSnackbar: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    action: PropTypes.string,
    onActionClick: PropTypes.func,
}

Snackbar.defaultProps = {
    action: '',
    onActionClick: () => null,
}

const mapStateToProps = ({ feedback }) => ({
    showSnackbar: feedback.showSnackbar,
    message: feedback.message,
    type: feedback.type,
})

const mapDispatchToProps = {
    onClose: clearFeedback,
}

const connectedSnackbar = connect(mapStateToProps, mapDispatchToProps)(Snackbar)

export { connectedSnackbar as Snackbar, Snackbar as SnackbarOriginal }
