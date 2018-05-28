/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* React Router */
import { Link } from 'react-router-dom';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { Sidebar, FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core';

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
    };

    constructor(props) {
        super(props);

        this.state = {
            d2: props.d2,
            currentSection: '',
            showSnackbar: false,
            snackbarConf: {
                type: '',
                message: '',
            },
            pageState: {},
        };
    }

    getContext() {
        return {
            d2: this.props.d2,
            showSnackbar: this.state.showSnackbar,
            snackbarConf: this.state.snackbarConf,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
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
                    show={this.state.showSnackbar}
                    conf={this.state.snackbarConf}
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

export default App;
