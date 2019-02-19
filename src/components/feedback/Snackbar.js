import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FeedbackSnackbar } from '@dhis2/d2-ui-core'
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
    showSnackbar: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
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

const connectedSnackbar = connect(
    mapStateToProps,
    mapDispatchToProps
)(Snackbar)

export { connectedSnackbar as Snackbar }
