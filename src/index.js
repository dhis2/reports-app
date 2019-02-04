/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* d2 */
import { init, getManifest, getUserSettings } from 'd2/lib/d2';

/* Redux */
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './redux/store';

/* i18n */
import { configI18n } from './utils/i18n/configI18n';
import { injectTranslationsToD2 } from './utils/i18n/injectTranslationsToD2';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

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
            'dataApprovalLevel',
        ],
    })
        .then((d2) => { d2Instance = d2; })
        .then(getUserSettings)
        .then(configI18n)
        .then(() => {
            injectTranslationsToD2(d2Instance);
            ReactDOM.render(
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App
                            d2={d2Instance}
                        />
                    </ConnectedRouter>
                </Provider>,
                document.getElementById('app'),
            );
        });
});

registerServiceWorker();
