import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import AppRouter from './components/AppRouter.jsx'
import { Loader } from './components/feedback/Loader.jsx'
import { AppShell } from './components/shell/AppShell.jsx'
import { loadDataSetOptions } from './redux/actions/dataSet.js'
import { loadOrganisationUnits } from './redux/actions/organisationUnits.js'
import { loadPeriodTypes } from './redux/actions/reportPeriod.js'
import {
    getCurrentSection,
    getShowSidebar,
} from './redux/selectors/sidebar/index.js'
import './global.css'

class App extends PureComponent {
    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadOrganisationUnits()
        this.props.loadPeriodTypes()
        this.props.loadDataSetOptions()
    }

    render() {
        return (
            <>
                <AppShell
                    showNav={this.props.showSidebar}
                    currentSection={this.props.currentSection}
                >
                    <AppRouter />
                </AppShell>
                <Loader />
            </>
        )
    }
}

App.propTypes = {
    currentSection: PropTypes.string.isRequired,
    d2: PropTypes.object.isRequired,
    loadDataSetOptions: PropTypes.func.isRequired,
    loadOrganisationUnits: PropTypes.func.isRequired,
    loadPeriodTypes: PropTypes.func.isRequired,
    showSidebar: PropTypes.bool.isRequired,
}

App.childContextTypes = {
    d2: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    currentSection: getCurrentSection(state),
    showSidebar: getShowSidebar(state),
})

export default connect(mapStateToProps, {
    loadOrganisationUnits,
    loadPeriodTypes,
    loadDataSetOptions,
})(App)
