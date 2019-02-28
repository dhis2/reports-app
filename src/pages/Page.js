import { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '../utils/i18n/locales'
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
                    : i18n.t('Unexpected Error')

            this.props.updateFeedbackState(true, {
                type: ERROR,
                message: messageError,
            })
        }
    }
}

export default Page
