/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* React Router */
import { HashRouter, withRouter } from 'react-router-dom';

/* d2 */
import { init, getManifest, getUserSettings } from 'd2/lib/d2';

/* i18n */
import { configI18n, injectTranslationsToD2 } from './configI18n';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

const AppComponent = withRouter(App);

/* init d2 */
let d2Instance;

getManifest('manifest.webapp').then((manifest) => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${manifest.dhis2.apiVersion}`;

    // init d2 with configs
    init({
        baseUrl,
        schemas: [
            'organisationUnit',
            'dataSet',
            'reportTable',
            'organisationUnitGroupSet',
        ],
    })
        .then((d2) => { d2Instance = d2; })
        .then(getUserSettings)
        .then(configI18n)
        .then(() => {
            injectTranslationsToD2(d2Instance);
            ReactDOM.render(
                <HashRouter>
                    <AppComponent
                        d2={d2Instance}
                    />
                </HashRouter>,
                document.getElementById('app'),
            );
        });
});

registerServiceWorker();
