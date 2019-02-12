/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/* React Router */
import { Link } from 'react-router-dom'

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import { Sidebar } from '@dhis2/d2-ui-core'

/* Redux */
import { connect } from 'react-redux'
import { updateFeedbackState } from './redux/actions/feedback'
import { loadPeriodTypes } from './redux/actions/reportPeriod'
import { loadOrganisationUnits } from './redux/actions/organisationUnits'
import { loadDataSetOptions } from './redux/actions/dataSet'

/* App components */
import AppRouter from './components/AppRouter'
import Feedback from './components/Feedback'

/* App context */
import AppContext from './pages/AppContext'
import createSnackbarConfig from './utils/snackbar/createSnackbarConfig'

/* App configs */
import { sections } from './conf../../config/sections.conf'

/* styles */
import styles from './utils/styles'

class App extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            d2: props.d2,
            pageState: {},
        }
    }

    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadOrganisationUnits()
        this.props.loadPeriodTypes()
        this.props.loadDataSetOptions()
    }

    onFeedbackSnackbarClose = () => {
        this.props.updateFeedbackState(false, this.state.snackbarConf)
    }

    getContext() {
        return {
            d2: this.props.d2,
            pageState: this.state.pageState,
        }
    }

    render() {
        // is not "marked" as required but it's used by Sidebar
        const nonOnChangeSection = () => null
        const sidebarSections = sections.map(section =>
            Object.assign(section, {
                icon: section.info.icon,
                label: section.info.label,
                containerElement: <Link to={section.path} />,
            })
        )

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
                            open={this.props.showSnackbar}
                            conf={this.props.snackbarConf}
                            onClose={this.onFeedbackSnackbarClose}
                        />
                    </div>
                </D2UIApp>
            </AppContext.Provider>
        )
    }
}

App.propTypes = {
    d2: PropTypes.object.isRequired,
    showSnackbar: PropTypes.bool.isRequired,
    snackbarConf: PropTypes.shape({
        type: PropTypes.string,
        message: PropTypes.string,
        action: PropTypes.string,
        onActionClick: PropTypes.func,
    }).isRequired,
    updateFeedbackState: PropTypes.func.isRequired,
    loadOrganisationUnits: PropTypes.func.isRequired,
    loadPeriodTypes: PropTypes.func.isRequired,
    loadDataSetOptions: PropTypes.func.isRequired,
    currentSection: PropTypes.string.isRequired,
}

App.childContextTypes = {
    d2: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    showSnackbar: state.feedback.showSnackbar,
    snackbarConf: createSnackbarConfig(state),
    currentSection: state.router.location.pathname.substring(1),
})

export default connect(
    mapStateToProps,
    {
        loadOrganisationUnits,
        loadPeriodTypes,
        updateFeedbackState,
        loadDataSetOptions,
    }
)(App)
