import { Route, Switch } from 'react-router-dom'
import React from 'react'

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

const AppRouter = () => (
    <AppContext.Consumer>
        {({ d2 }) => (
            <main>
                <Switch>
                    <Route
                        key="home"
                        exact
                        path="/"
                        render={() => <Home sectionKey="home" />}
                    />
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
                            sections[
                                ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY
                            ].path
                        }
                        component={OrganisationUnitDistributionReport}
                    />
                    <Route key="no-match-route" component={NoMatch} />
                </Switch>
            </main>
        )}
    </AppContext.Consumer>
)

//const _AppRouter = () => {
//const routes = sections.map(section => {
//const routeRender = () => {
//const Page = section.component
//return (
//<AppContext.Consumer>
//{appContext => (
//<Page
//d2={appContext.d2}
//sectionKey={section.key}
//{...appContext.pageState}
///>
//)}
//</AppContext.Consumer>
//)
//}
//return (
//<Route
//key={section.key}
//exact
//path={section.path}
//render={routeRender}
///>
//)
//})

//[> Home route <]
//const homeRouteRender = () => <Home sectionKey="home" />

//routes.push(<Route key="home" exact path="/" render={homeRouteRender} />)

//[> No Match Route <]
//routes.push(<Route key="no-match-route" component={NoMatch} />)

//return (
//<main>
//<Switch>{routes}</Switch>
//</main>
//)
//}

export default AppRouter
