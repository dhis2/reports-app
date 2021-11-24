import { getIsUiBlocked } from '../getIsUiBlocked.js'

export const getShowLoading = (state) =>
    state.feedback.showLoader || getIsUiBlocked(state)
