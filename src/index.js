/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* React Router */
import { HashRouter, withRouter } from 'react-router-dom';

/* d2 */
import { getManifest, init } from 'd2/lib/d2';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

const AppComponent = withRouter(App);

/* init d2 */
getManifest('manifest.webapp').then((manifest) => {
    const api = process.env.REACT_APP_DHIS2_API_VERSION ? `/${process.env.REACT_APP_DHIS2_API_VERSION}` : '/';
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api${api}`;

    // init d2 with configs
    init({
        baseUrl,
        schemas: [
            'organisationUnit',
            'dataSet',
        ],
    }).then((d2) => {
        ReactDOM.render(
            <HashRouter>
                <AppComponent d2={d2} />
            </HashRouter>,
            document.getElementById('app'),
        );
    });
});

registerServiceWorker();
