import PropTypes from 'prop-types';
import i18n from '../locales';
import { i18nKeys } from '../i18n';
import { ERROR } from '../helpers/feedbackSnackBarTypes';
import getDisplayName from '../utils/react/getDisplayName';

const manageError = (component) => {
    const WrappedComponent = class extends component {
        static propTypes = {
            // sectionKey - required and used by pages to get help link
            // eslint-disable-next-line
            sectionKey: PropTypes.string.isRequired,
        };

        static defaultProps = component.defaultProps || {};

        pageMounted = false;

        componentDidMount() {
            super.componentDidMount();
            this.pageMounted = true;
        }

        componentWillUnmount() {
            super.componentWillUnmount();
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

                this.props.updateFeedbackState(true, {
                    type: ERROR,
                    message: messageError,
                });
            }
        }
    };

    WrappedComponent.displayName = `WithErrorManagement(${getDisplayName(component)})`;
    return WrappedComponent;
};

export default manageError;
