import React from 'react'
import ReactDOM from 'react-dom'
import { init, getManifest, getUserSettings } from 'd2'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store from './redux/store'
import history from './utils/history'
import { configI18n } from './utils/i18n/configI18n'
import injectTranslationsToD2 from './utils/i18n/injectTranslationsToD2'
import { initApi, getD2 } from './utils/api'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

getManifest('manifest.webapp').then(manifest => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${
                  manifest.dhis2.apiVersion
              }`

    // init d2 with configs
    init({
        baseUrl,
        schemas: [
            'dataApprovalLevel',
            'dataSet',
            'organisationUnit',
            'organisationUnitGroupSet',
            'report',
            'reportTable',
        ],
    })
        .then(initApi)
        .then(getUserSettings)
        .then(configI18n)
        .then(() => {
            const d2Instance = getD2()
            injectTranslationsToD2(d2Instance)
            ReactDOM.render(
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App d2={d2Instance} />
                    </ConnectedRouter>
                </Provider>,
                document.getElementById('app')
            )
        })
})

registerServiceWorker()
