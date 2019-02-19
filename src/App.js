import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import D2UIApp from '@dhis2/d2-ui-app'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import { Sidebar } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import { loadPeriodTypes } from './redux/actions/reportPeriod'
import { loadOrganisationUnits } from './redux/actions/organisationUnits'
import { loadDataSetOptions } from './redux/actions/dataSet'
import AppRouter from './components/AppRouter'
import { Loader } from './components/feedback/Loader'
import AppContext from './pages/AppContext'
import { sections } from './conf../../config/sections.conf'
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
                    <Loader />
                </D2UIApp>
            </AppContext.Provider>
        )
    }
}

App.propTypes = {
    currentSection: PropTypes.string.isRequired,
    d2: PropTypes.object.isRequired,
    loadPeriodTypes: PropTypes.func.isRequired,
    loadDataSetOptions: PropTypes.func.isRequired,
    loadOrganisationUnits: PropTypes.func.isRequired,
}

App.childContextTypes = {
    d2: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    currentSection: state.router.location.pathname.substring(1),
})

export default connect(
    mapStateToProps,
    {
        loadOrganisationUnits,
        loadPeriodTypes,
        loadDataSetOptions,
    }
)(App)
