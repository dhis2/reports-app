import { connect } from 'react-redux'
import { updateFeedbackState } from '../../redux/actions/feedback'

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
})

export const connectDataSetReport = component =>
    connect(
        null,
        mapDispatchToProps
    )(component)
