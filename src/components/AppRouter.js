import { Route, Switch } from 'react-router-dom'
import React from 'react'
import PropTypes from 'prop-types'

import {
    DATA_SET_REPORT_SECTION_KEY,
    ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_SECTION_KEY,
} from '../config/sections.config'
import { DataSetReport } from '../pages/DataSetReport'
import { OrganisationUnitDistributionReport } from '../pages/OrganisationUnitDistributionReport'
import { ReportingRateSummary } from '../pages/ReportingRateSummary'
import { Resource } from '../pages/Resource'
import { StandardReport } from '../pages/StandardReport'
import { sections } from '../conf../../config/sections.config'
import AppContext from '../pages/AppContext'
import Home from '../pages/home/Home'
import NoMatch from './NoMatch'

const AppRouter = ({ d2 }) => (
    <main>
        <Switch>
            <Route key="home" exact path="/" component={Home} />
            <Route
                exact
                key={STANDARD_REPORT_SECTION_KEY}
                path={sections[STANDARD_REPORT_SECTION_KEY].path}
                render={() => <StandardReport d2={d2} />}
            />
            <Route
                exact
                key={DATA_SET_REPORT_SECTION_KEY}
                path={sections[DATA_SET_REPORT_SECTION_KEY].path}
                component={DataSetReport}
            />
            <Route
                exact
                key={REPORTING_RATE_SUMMARY_SECTION_KEY}
                path={sections[REPORTING_RATE_SUMMARY_SECTION_KEY].path}
                component={ReportingRateSummary}
            />
            <Route
                exact
                key={RESOURCE_SECTION_KEY}
                path={sections[RESOURCE_SECTION_KEY].path}
                render={() => <Resource d2={d2} />}
            />
            <Route
                exact
                key={ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY}
                path={
                    sections[ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY]
                        .path
                }
                component={OrganisationUnitDistributionReport}
            />
            <Route key="no-match-route" component={NoMatch} />
        </Switch>
    </main>
)

AppRouter.propTypes = {
    d2: PropTypes.object.isRequired,
}

const AppRouterWithD2 = () => (
    <AppContext.Consumer>
        {({ d2 }) => <AppRouter d2={d2} />}
    </AppContext.Consumer>
)

export default AppRouterWithD2
export { AppRouter as AppRouterComponent }
