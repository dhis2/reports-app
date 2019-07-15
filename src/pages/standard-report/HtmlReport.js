import PropTypes from 'prop-types'
import React from 'react'
import { getContextPath } from '../../utils/api'
import CircularProgress from '@material-ui/core/CircularProgress'

const SCRIPTS = [
    '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
]

const wrapHtmlInTemplate = html => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${SCRIPTS.map(createScriptTag).join('\n')}
        </head>
        <body>
            ${html}
        </body>
    </html>
`
const createScriptTag = script => {
    const src = getContextPath() + script
    return `<script src="${src}" type="text/javascript"></script>`
}

const Loader = () => (
    <div>
        <CircularProgress />
        <style jsx>{`
            div {
                text-align: center;
                margin: 16px;
            }
        `}</style>
    </div>
)

const HtmlReport = ({ html }) =>
    html ? (
        <iframe
            id="html-report-id"
            srcDoc={wrapHtmlInTemplate(html)}
            title="html-report-content"
            width="100%"
            seamless={true}
            sandbox="allow-same-origin allow-scripts allow-modals"
        >
            <style jsx>{`
                iframe {
                    border: none;
                    height: 900px;
                }
            `}</style>
        </iframe>
    ) : (
        <Loader />
    )

HtmlReport.propTypes = {
    html: PropTypes.string.isRequired,
}

export default HtmlReport
