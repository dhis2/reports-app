import '@babel/polyfill'
import { ConnectedRouter } from 'connected-react-router'
import { getManifest, getUserSettings, init } from 'd2'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'typeface-roboto'
import App from './App'
import store from './redux/store'
import registerServiceWorker from './registerServiceWorker'
import { getD2, initApi } from './utils/api'
import history from './utils/history'
import { configI18n } from './utils/i18n/configI18n'
import injectTranslationsToD2 from './utils/i18n/injectTranslationsToD2'

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
            'userGroup',
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
