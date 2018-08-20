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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFeedbackState } from './reducers/feedback';

/* App components */
import AppRouter from './components/app-router/AppRouter';

/* App context */
import AppContext from './context';

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
    };

    constructor(props) {
        super(props);

        this.state = {
            d2: props.d2,
            currentSection: '',
            pageState: {},
        };
    }

    onFeedbackSnackbarClose = () => {
        this.props.updateFeedbackState(false, {
            type: '',
            message: 'test',
        });
    };

    getContext() {
        return {
            d2: this.props.d2,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
            pageState: this.state.pageState,
        };
    }

    /* function to keep app state */
    /* using arrow function no need for binding on constructor */
    updateAppState = (appState) => {
        if (appState.currentSection
            && !appState.pageState
            && this.state.currentSection !== appState.currentSection) {
            // clear page state because we are updating page
            this.setState({ ...appState, pageState: {}, showSnackbar: false });
        } else {
            this.setState(appState);
        }
    }

    render() {
        const nonOnChangeSection = () => null;
        const sidebarSections = sections.map(section => Object.assign(
            section,
            {
                icon: section.info.icon,
                label: section.info.label,
                containerElement: <Link to={section.path} />,
            },
        ));

        const feedbackElement = this.state.pageState.loading ?
            (
                <div style={styles.feedbackSnackBar}>
                    <CircularProgress />
                </div>
            ) : (
                <FeedbackSnackbar
                    onClose={this.onFeedbackSnackbarClose}
                    show={this.props.showSnackbar}
                    conf={this.props.snackbarConf}
                />
            );

        return (
            <AppContext.Provider value={this.getContext()}>
                <D2UIApp>
                    <HeaderBar d2={this.props.d2} />
                    <Sidebar
                        sections={sidebarSections}
                        currentSection={this.state.currentSection}
                        onChangeSection={nonOnChangeSection}
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

const mapStateToProps = ({ feedback }) => ({
    showSnackbar: feedback.showSnackbar,
    snackbarConf: { ...feedback.snackbarConf },
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateFeedbackState,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
