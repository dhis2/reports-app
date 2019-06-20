import { Route, Switch } from 'react-router-dom'
import React from 'react'
// import PropTypes from 'prop-types'

import {
    DATA_SET_REPORT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_SECTION_KEY,
} from '../config/sections.config'
import { DataSetReport } from '../pages/DataSetReport'
import { OrganisationUnitDistributionReport } from '../pages/OrganisationUnitDistributionReport'
import { ReportingRateSummary } from '../pages/ReportingRateSummary'
import { Resource } from '../pages/Resource'
import { StandardReport } from '../pages/StandardReport'
import StyledHtmlReport from '../pages/standard-report/StyledHtmlReport'
import { sections } from '../config/sections.config'
import Home from '../pages/home/Home'
import NoMatch from './NoMatch'
import { ConnectedAddEditStdReport } from '../pages/standard-report/AddEditStdReport'

const standardReportPath = sections[STANDARD_REPORT_SECTION_KEY].path

const AppRouter = () => (
    <main>
        <Switch>
            <Route key="home" exact path="/" component={Home} />
            <Route
                exact
                key={STANDARD_REPORT_SECTION_KEY}
                path={standardReportPath}
                component={StandardReport}
            />
            <Route
                exact
                key={`${STANDARD_REPORT_SECTION_KEY}-viewHTMLReport`}
                path={`${standardReportPath}/view/:id`}
                component={StyledHtmlReport}
            />
            <Route
                exact
                key={`${STANDARD_REPORT_SECTION_KEY}-addEdit`}
                // /edit/id or /new
                path={`${standardReportPath}/:mode/:id?`}
                component={ConnectedAddEditStdReport}
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
                component={Resource}
            />
            <Route
                exact
                key={ORG_UNIT_DIST_REPORT_SECTION_KEY}
                path={sections[ORG_UNIT_DIST_REPORT_SECTION_KEY].path}
                component={OrganisationUnitDistributionReport}
            />
            <Route key="no-match-route" component={NoMatch} />
        </Switch>
    </main>
)

export default AppRouter
