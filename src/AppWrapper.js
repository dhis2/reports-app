import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'flexboxgrid/css/flexboxgrid.css'
import './locales'

import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import D2UIApp from '@dhis2/d2-ui-app'
import { mui3theme } from '@dhis2/d2-ui-core'
import {
    MuiThemeProvider as Mui3ThemeProvider,
    createMuiTheme as createMui3Theme,
} from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Provider } from 'react-redux'
import App from './App'
import store from './redux/store'
import { initApi } from './utils/api'
import history from './utils/history'
import injectTranslationsToD2 from './utils/injectTranslationsToD2'

const MUI3Theme = createMui3Theme(mui3theme)

const AppWrapper = () => {
    const { baseUrl } = useConfig()
    const { d2 } = useD2({
        d2Config: {
            baseUrl: baseUrl + '/api',
            schemas: [
                'dataApprovalLevel',
                'dataSet',
                'organisationUnit',
                'organisationUnitGroupSet',
                'report',
            ],
        },
        onInitialized: (d2) => {
            initApi(d2)
            injectTranslationsToD2(d2)
        },
    })

    if (!d2) {
        return null
    }

    return (
        <D2UIApp>
            <Mui3ThemeProvider theme={MUI3Theme}>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App d2={d2} />
                    </ConnectedRouter>
                </Provider>
            </Mui3ThemeProvider>
        </D2UIApp>
    )
}

export default AppWrapper
