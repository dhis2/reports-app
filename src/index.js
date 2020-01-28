import '@babel/polyfill'
import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import { getManifest, getUserSettings, init } from 'd2'
import { Provider as RuntimeProvider } from '@dhis2/app-runtime'
import { CssReset } from '@dhis2/ui-core'

import store from './redux/store'
import { getD2, initApi } from './utils/api'
import history from './utils/history'
import { configI18n } from './utils/i18n/configI18n'
import injectTranslationsToD2 from './utils/i18n/injectTranslationsToD2'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

getManifest('manifest.webapp').then(manifest => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? manifest.getBaseUrl()
            : process.env.REACT_APP_DHIS2_BASE_URL

    const apiUrl = `${baseUrl}/api`

    // init d2 with configs
    init({
        baseUrl: apiUrl,
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
                <RuntimeProvider
                    config={{
                        baseUrl,
                        apiVersion: '',
                    }}
                >
                    <Provider store={store}>
                        <ConnectedRouter history={history}>
                            <CssReset />
                            <App d2={d2Instance} />
                        </ConnectedRouter>
                    </Provider>
                </RuntimeProvider>,
                document.getElementById('app')
            )
        })
})

registerServiceWorker()
