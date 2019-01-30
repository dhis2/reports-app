/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* React Router */
import { Link } from 'react-router-dom';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { Sidebar, FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from './actions/feedback';
import { deleteStandardReport } from './actions/standardReport';

/* App components */
import AppRouter from './components/app-router/AppRouter';

/* App context */
import AppContext from './context';
import { LOADING } from './helpers/feedbackSnackBarTypes';
import createSnackbarConfig from './utils/snackbar/createSnackbarConfig';

/* App configs */
import { sections } from './pages/sections.conf';

/* styles */
import styles from './styles';

class App extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        showSnackbar: PropTypes.bool.isRequired,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            action: PropTypes.string,
            onActionClick: PropTypes.func,
        }).isRequired,
        updateFeedbackState: PropTypes.func.isRequired,
        currentSection: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            d2: props.d2,
            pageState: {},
        };
    }

    onFeedbackSnackbarClose = () => {
        this.props.updateFeedbackState(false, this.state.snackbarConf);
    };

    getContext() {
        return {
            d2: this.props.d2,
            pageState: this.state.pageState,
        };
    }

    render() {
        // is not "marked" as required but it's used by Sidebar
        const nonOnChangeSection = () => null;
        const sidebarSections = sections.map(section => Object.assign(
            section,
            {
                icon: section.info.icon,
                label: section.info.label,
                containerElement: <Link to={section.path} />,
            },
        ));

        const feedbackElement = this.props.snackbarConf.type === LOADING ?
            (
                <div style={styles.feedbackSnackBar}>
                    <CircularProgress />
                </div>
            ) : (
                <span id={'feedbackSnackbarId'}>
                    <FeedbackSnackbar
                        onClose={this.onFeedbackSnackbarClose}
                        show={this.props.showSnackbar}
                        conf={this.props.snackbarConf}
                    />
                </span>
            );

        return (
            <AppContext.Provider value={this.getContext()}>
                <D2UIApp>
                    <HeaderBar d2={this.props.d2} />
                    <Sidebar
                        sections={sidebarSections}
                        onChangeSection={nonOnChangeSection}
                        currentSection={this.props.currentSection}
                    />
                    <div style={styles.contentWrapper}>
                        <div style={styles.contentArea}>
                            <AppRouter />
                        </div>
                    </div>
                    <div id="feedback-snackbar">
                        {feedbackElement}
                    </div>
                </D2UIApp>
            </AppContext.Provider>
        );
    }
}

const mapStateToProps = state => ({
    showSnackbar: state.feedback.showSnackbar,
    snackbarConf: createSnackbarConfig(state),
    currentSection: state.router.location.pathname.substring(1),

    state,
});

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
    deleteStandardReport: () => dispatch(deleteStandardReport()),
});

/**
 * This is a temporary solution until all components
 * have been separated from business logic.
 */
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { state, ...realStateProps } = stateProps;
    const {
        deleteStandardReport: deleteStandardReportActionDispatcher,
        ...realDispatchProps
    } = dispatchProps;

    if (stateProps.state.standardReport.requestDelete) {
        return {
            ...ownProps,
            ...{
                ...realStateProps,
                snackbarConf: {
                    ...realStateProps.snackbarConf,
                    onActionClick: deleteStandardReportActionDispatcher,
                },
            },
            ...realDispatchProps,
        };
    }

    return { ...ownProps, ...realStateProps, ...realDispatchProps };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(App);
