/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* React Router */
import { Link } from 'react-router-dom';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { Sidebar } from '@dhis2/d2-ui-core';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from './actions/feedback';

/* App components */
import AppRouter from './components/app-router/AppRouter';
import Feedback from './components/Feedback';

/* App context */
import AppContext from './context';
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
                        <Feedback
                            show={this.props.showSnackbar}
                            conf={this.props.snackbarConf}
                            onClose={this.onFeedbackSnackbarClose}
                        />
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
});

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
