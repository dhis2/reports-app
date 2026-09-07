import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
    sections,
    COLD_CHAIN_FRIDGE_LOG_SECTION_KEY,
    MALARIA_WEEKLY_BULLETIN_SECTION_KEY,
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    DATA_SET_REPORT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
    STANDARD_REPORT_SECTION_KEY,
} from '../config/sections.config.js'
import { ColdChainFridgeLog } from '../pages/cold-chain-fridge-log/ColdChainFridgeLog.jsx'
import { DataSetReportNext } from '../pages/data-set-report-next/DataSetReportNext.jsx'
import { DataSetReport } from '../pages/DataSetReport.jsx'
import Home from '../pages/home/Home.jsx'
import { MalariaWeeklyBulletin } from '../pages/malaria-weekly-bulletin/MalariaWeeklyBulletin.jsx'
import { OrgUnitDistReportNext } from '../pages/organisation-unit-distribution-report-next/OrgUnitDistReportNext.jsx'
import { OrganisationUnitDistributionReport } from '../pages/OrganisationUnitDistributionReport.jsx'
import { ReportingRateSummary } from '../pages/ReportingRateSummary.jsx'
import { AddEditResource } from '../pages/resource/AddEditResource.jsx'
import { Resource } from '../pages/Resource.jsx'
import { ConnectedAddEditStdReport } from '../pages/standard-report/AddEditStdReport.jsx'
import StyledHtmlReport from '../pages/standard-report/StyledHtmlReport.jsx'
import { NewStandardReport } from '../pages/standard-report-next/NewStandardReport.jsx'
import { ReportBrowse } from '../pages/standard-report-next/ReportBrowse.jsx'
import { StandardReportNext } from '../pages/standard-report-next/StandardReportNext.jsx'
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
                key={STANDARD_REPORT_NEXT_SECTION_KEY}
                path={sections[STANDARD_REPORT_NEXT_SECTION_KEY].path}
                component={ReportBrowse}
            />
            <Route
                exact
                key={`${STANDARD_REPORT_NEXT_SECTION_KEY}-new`}
                path={`${sections[STANDARD_REPORT_NEXT_SECTION_KEY].path}/new`}
                component={NewStandardReport}
            />
            <Route
                exact
                key={`${STANDARD_REPORT_NEXT_SECTION_KEY}-report`}
                path={`${sections[STANDARD_REPORT_NEXT_SECTION_KEY].path}/:id(${ID_REGEXP})`}
                component={StandardReportNext}
            />
            <Route
                exact
                key={DATA_SET_REPORT_SECTION_KEY}
                path={sections[DATA_SET_REPORT_SECTION_KEY].path}
                component={DataSetReport}
            />
            <Route
                exact
                key={DATA_SET_REPORT_NEXT_SECTION_KEY}
                path={sections[DATA_SET_REPORT_NEXT_SECTION_KEY].path}
                component={DataSetReportNext}
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
            <Route
                exact
                key={ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY}
                path={sections[ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY].path}
                component={OrgUnitDistReportNext}
            />
            <Route
                exact
                key={COLD_CHAIN_FRIDGE_LOG_SECTION_KEY}
                path={sections[COLD_CHAIN_FRIDGE_LOG_SECTION_KEY].path}
                component={ColdChainFridgeLog}
            />
            <Route
                exact
                key={MALARIA_WEEKLY_BULLETIN_SECTION_KEY}
                path={sections[MALARIA_WEEKLY_BULLETIN_SECTION_KEY].path}
                component={MalariaWeeklyBulletin}
            />
            <Route key="no-match-route" component={NoMatch} />
        </Switch>
    </main>
)

export default AppRouter
