import 'typeface-roboto'
import { ConnectedRouter } from 'connected-react-router'
import { getUserSettings, init } from 'd2'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './redux/store'
import * as serviceWorker from './serviceWorker'
import { getD2, initApi } from './utils/api'
import history from './utils/history'
import { configI18n } from './utils/i18n/configI18n'
import injectTranslationsToD2 from './utils/i18n/injectTranslationsToD2'

const { REACT_APP_DHIS2_BASE_URL } = process.env

// init d2 with configs
init({
    baseUrl: `${REACT_APP_DHIS2_BASE_URL}/api/`,
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
            document.getElementById('root')
        )
    })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register()
