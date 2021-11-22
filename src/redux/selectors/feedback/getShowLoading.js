import { getIsUiBlocked } from '../getIsUiBlocked'

export const getShowLoading = (state) =>
    state.feedback.showLoader || getIsUiBlocked(state)
