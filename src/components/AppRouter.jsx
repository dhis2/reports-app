import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
    sections,
    DATA_SET_REPORT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_SECTION_KEY,
} from '../config/sections.config.js'
import { DataSetReport } from '../pages/DataSetReport.jsx'
import Home from '../pages/home/Home.jsx'
import { OrganisationUnitDistributionReport } from '../pages/OrganisationUnitDistributionReport.jsx'
import { ReportingRateSummary } from '../pages/ReportingRateSummary.jsx'
import { AddEditResource } from '../pages/resource/AddEditResource.jsx'
import { Resource } from '../pages/Resource.jsx'
import { ConnectedAddEditStdReport } from '../pages/standard-report/AddEditStdReport.jsx'
import StyledHtmlReport from '../pages/standard-report/StyledHtmlReport.jsx'
import { StandardReport } from '../pages/StandardReport.jsx'
import NoMatch from './NoMatch.jsx'

const standardReportPath = sections[STANDARD_REPORT_SECTION_KEY].path
const resourcePath = sections[RESOURCE_SECTION_KEY].path
// Used to ensure we are matching the pattern of an actual id
const ID_REGEXP = '[a-zA-Z][a-zA-Z0-9]{10}'

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
                path={`${standardReportPath}/view/:id(${ID_REGEXP})`}
                component={StyledHtmlReport}
            />
            <Route
                exact
                key={`${STANDARD_REPORT_SECTION_KEY}-addEdit`}
                // /edit/id or /new
                path={`${standardReportPath}/:mode/:id(${ID_REGEXP})?`}
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
                path={resourcePath}
                component={Resource}
            />
            <Route
                exact
                key={`${RESOURCE_SECTION_KEY}-addEdit`}
                // /edit/id or /new
                path={`${resourcePath}/:mode/:id(${ID_REGEXP})?`}
                component={AddEditResource}
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
