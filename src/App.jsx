import { Sidebar } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
        return (
            <div>
                {this.props.showSidebar && (
                    <Sidebar
                        sections={sidebarSections}
                        onChangeSection={nonOnChangeSection}
                        currentSection={this.props.currentSection}
                    />
                )}
                <div className="content-wrapper">
                    <div className="content-area">
                        <AppRouter />
                    </div>
                    <style jsx>{`
                        .content-wrapper {
                            margin-left: ${this.props.showSidebar
                                ? '295px'
                                : '0'};
                        }
                        .content-area {
                            padding: 1rem 20px 20px;
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
                            margin-top: 3rem;
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
