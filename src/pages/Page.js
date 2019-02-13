/* React */
import { Component } from 'react'
import PropTypes from 'prop-types'

/* i18n */
import i18n from '../utils/i18n/locales'
import { i18nKeys } from '../utils/i18n/i18nKeys'

/* Feedback Snackbar */
import { ERROR } from '../utils/feedbackTypes.js'

class Page extends Component {
    static propTypes = {
        // sectionKey - required and used by pages to get help link
        // eslint-disable-next-line
        sectionKey: PropTypes.string.isRequired,
        updateFeedbackState: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.pageMounted = true
    }

    componentWillUnmount() {
        this.pageMounted = false
    }

    isPageMounted() {
        return this.pageMounted
    }

    manageError(error) {
        if (this.isPageMounted()) {
            const messageError =
                error && error.message
                    ? error.message
                    : i18n.t(i18nKeys.messages.unexpectedError)

            this.props.updateFeedbackState(true, {
                type: ERROR,
                message: messageError,
            })
        }
    }
}

export default Page
