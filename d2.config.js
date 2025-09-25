/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',
    coreApp: true,
    title: 'Reports',
    id: 'b7e619e4-5b9f-4b8b-a4ff-9874f197ae39',
    minDHIS2Version: '2.33',
    name: 'reports',
    entryPoints: {
        app: './src/AppWrapper.jsx',
    },
    viteConfigExtensions: {
        define: {
            global: 'window',
        },
    },
    shortcuts: [
        {
            name: 'Standard report',
            url: '#/standard-report',
        },
        {
            name: 'Data set report',
            url: '#/data-set-report',
        },
        {
            name: 'Reporting rates summary',
            url: '#/reporting-rate-summary',
        },
        {
            name: 'Resources',
            url: '#/resource',
        },
        {
            name: 'Org unit distribution report',
            url: '#/organisation-unit-distribution-report',
        },
    ],
}

module.exports = config
