/* React */
import React from 'react';
import ReactDOM from 'react-dom';

// D2
import { getManifest, getUserSettings } from 'd2/lib/d2';
// import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

// init d2
getManifest('manifest.webapp').then((manifest) => {
    /*
    const api = process.env.REACT_APP_DHIS2_API_VERSION ? `/${process.env.REACT_APP_DHIS2_API_VERSION}` : '/';
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api${api}`;
    */
    ReactDOM.render(<App />, document.getElementById('root'));
}).then(getUserSettings);

registerServiceWorker();
