import { blockUi } from './blockUi'

export const feedbackShowLoading = state =>
    state.feedback.showLoader || blockUi(state)
