/* React */
import { Component } from 'react';
import PropTypes from 'prop-types';

/* i18n */
import i18n from '../locales';
import { i18nKeys } from '../i18n';

/* Feedback Snackbar */
import { ERROR } from '../helpers/feedbackSnackBarTypes';

class Page extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
        currentSection: PropTypes.string.isRequired,
        updateAppState: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.pageMounted = true;

        // update section on side bar
        if (this.props.currentSection !== this.props.sectionKey) {
            this.props.updateAppState({
                currentSection: this.props.sectionKey,
            });
        }
    }

    componentWillUnmount() {
        this.pageMounted = false;
    }

    isPageMounted() {
        return this.pageMounted;
    }

    manageError(error) {
        if (this.isPageMounted()) {
            const messageError = error && error.message ?
                error.message :
                i18n.t(i18nKeys.messages.unexpectedError);

            this.props.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: ERROR,
                    message: messageError,
                },
                pageState: {
                    loading: false,
                },
            });
        }
    }
}

export default Page;
