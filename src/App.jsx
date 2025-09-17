import { Sidebar } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './App.module.css'
import AppRouter from './components/AppRouter.jsx'
import { Loader } from './components/feedback/Loader.jsx'
import { sectionOrder, sections } from './config/sections.config.js'
import { loadDataSetOptions } from './redux/actions/dataSet.js'
import { loadOrganisationUnits } from './redux/actions/organisationUnits.js'
import { loadPeriodTypes } from './redux/actions/reportPeriod.js'
import {
    getCurrentSection,
    getShowSidebar,
} from './redux/selectors/sidebar/index.js'
import './global.css'

// is not "marked" as required but it's used by Sidebar
const nonOnChangeSection = () => null
const sidebarSections = sectionOrder.map((sectionKey) => {
    const section = sections[sectionKey]
    return {
        ...section,
        icon: section.info.icon,
        label: section.info.label,
        containerElement: <Link to={section.path} />,
    }
})

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
        const wrapperClass = this.props.showSidebar
            ? styles.contentWrapper
            : styles.contentWrapperNoSidebar

        return (
            <div>
                {this.props.showSidebar && (
                    <Sidebar
                        sections={sidebarSections}
                        onChangeSection={nonOnChangeSection}
                        currentSection={this.props.currentSection}
                    />
                )}
                <div className={wrapperClass}>
                    <div className={styles.contentArea}>
                        <AppRouter />
                    </div>
                </div>
                <Loader />
            </div>
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
