import { Link } from 'react-router-dom'
import {
    MuiThemeProvider as Mui3ThemeProvider,
    createMuiTheme as createMui3Theme,
} from '@material-ui/core/styles'
import { Sidebar, mui3theme } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import D2UIApp from '@dhis2/d2-ui-app'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { Loader } from './components/feedback/Loader'
import { loadDataSetOptions } from './redux/actions/dataSet'
import { loadOrganisationUnits } from './redux/actions/organisationUnits'
import { loadPeriodTypes } from './redux/actions/reportPeriod'
import { sectionOrder, sections } from './config/sections.config'
import AppContext from './pages/AppContext'
import AppRouter from './components/AppRouter'

const MUI3Theme = createMui3Theme(mui3theme)

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
        const sidebarSections = sectionOrder.map(sectionKey => {
            const section = sections[sectionKey]
            return {
                ...section,
                icon: section.info.icon,
                label: section.info.label,
                containerElement: <Link to={section.path} />,
            }
        })

        return (
            <AppContext.Provider value={this.getContext()}>
                <D2UIApp>
                    <Mui3ThemeProvider theme={MUI3Theme}>
                        <HeaderBar d2={this.props.d2} />
                        <Sidebar
                            sections={sidebarSections}
                            onChangeSection={nonOnChangeSection}
                            currentSection={this.props.currentSection}
                        />
                        <div className="content-wrapper">
                            <div className="content-area">
                                <AppRouter />
                            </div>
                        </div>
                        <Loader />
                    </Mui3ThemeProvider>
                </D2UIApp>
                <style jsx>{`
                    .content-wrapper {
                        margin-left: 295px;
                        max-width: 1400px;
                    }
                    .content-area {
                        padding: 4rem 20px 20px;
                    }
                `}</style>
                <style jsx global>{`
                    body {
                        margin: 0;
                        padding: 0;
                    }

                    html {
                        background: #f3f3f3;
                        font-family: 'Roboto', sans-serif;
                    }

                    h1 {
                        font-size: 24px;
                        font-weight: 300;
                        letter-spacing: 1.2px;
                        color: rgba(0, 0, 0, 0.87);
                        display: flex;
                        align-items: center;
                        height: 48px;
                    }

                    .left-bar {
                        width: 295px;
                        position: fixed;
                        bottom: 0;
                        top: 0;
                        left: 0;
                        padding-top: 3rem;
                    }

                    .d2-ui-table {
                        margin-bottom: 0 !important;
                        margin-top: 0 !important;
                    }

                    .d2-ui-table__rows__row {
                        font-size: 14px;
                    }

                    .data-table-pager--page-info {
                        padding: 0 !important;
                    }

                    .data-table-pager--buttons {
                        margin-top: 10px !important;
                        margin-bottom: 10px !important;
                    }

                    .data-table-pager--buttons .material-icons {
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    #report-container table {
                        width: 100% !important;
                    }
                `}</style>
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
