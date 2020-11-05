export const CSS_FILES = [
    {
        media: 'screen',
        styleSheet:
            '/dhis-web-commons/javascripts/jQuery/ui/css/redmond/jquery-ui.css',
    },
    {
        media: 'print',
        styleSheet: '/dhis-web-commons/css/print.css',
    },
    {
        media: 'screen,print',
        styleSheet: '/dhis-web-commons/css/themes/light_blue/light_blue.css',
    },
]

export const SCRIPT_FILES = [
    '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.utils.js',
    '/dhis-web-commons/javascripts/jQuery/ui/jquery-ui.min.js',
    '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
    '/dhis-web-commons/javascripts/commons.js',
    '/dhis-web-commons/javascripts/commons.ajax.js',
    '/dhis-web-commons/javascripts/lists.js',
    '/dhis-web-commons/javascripts/periodType.js',
    '/dhis-web-commons/javascripts/date.js',
    '/dhis-web-commons/oust/oust.js',
]

export const PAGE_STYLES = `
    html {
        line-height: 1.15;
        text-size-adjust: 100%;
    }
    body {
        font-family: Roboto, sans-serif;
        box-sizing: inherit;
    }
    table {
        margin-top: 16px;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #bcbcbc;
        padding: 4px;
    }
`
