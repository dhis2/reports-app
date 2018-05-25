import React from 'react';
import PropTypes from 'prop-types';

import { Route, Switch } from 'react-router-dom';

import Home from '../../pages/home/Home';
import NoMatch from './NoMatch';

// App configs
import { sections } from '../../pages/sections.conf';

const AppRouter = ({ pageState }) => {
    const routes = sections.map((section) => {
        const routeRender = () => {
            const Page = section.component;
            return (
                <Page
                    sectionKey={section.key}
                    {...pageState}
                />
            );
        };
        return (
            <Route
                key={section.key}
                exact
                path={section.path}
                render={routeRender}
            />
        );
    });

    /* Home route */
    const homeRouteRender = () => (
        <Home sectionKey="home" />
    );

    routes.push(<Route key="home" exact path="/" render={homeRouteRender} />);

    /* No Match Route */
    routes.push(<Route key="no-match-route" component={NoMatch} />);

    return (
        <main>
            <Switch>
                {routes}
            </Switch>
        </main>
    );
};

AppRouter.propTypes = {
    pageState: PropTypes.object,
};

AppRouter.defaultProps = {
    pageState: {},
};

export default AppRouter;
