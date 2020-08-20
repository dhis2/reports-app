import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContextPath } from '../../utils/api'
import CircularProgress from '@material-ui/core/CircularProgress'

const SCRIPTS = [
    '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
    '/dhis-web-commons/oust/oust.js',
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

class HtmlReport extends Component {
    state = { heigth: 'auto' }
    iframeHtml = null
    iframeBody = null
    heightObserver = null

    onIframeLoad = event => {
        const iframe = event.target

        this.iframeHtml = iframe.contentWindow.document.documentElement
        this.iframeBody = iframe.contentWindow.document.body
        this.heightObserver = new window.ResizeObserver(this.adjustHeight)

        this.heightObserver.observe(this.iframeHtml)
        this.heightObserver.observe(this.iframeBody)
        this.adjustHeight()
    }

    adjustHeight = () => {
        const height = Math.max(
            this.iframeBody.clientHeight,
            this.iframeBody.scrollHeight,
            this.iframeBody.offsetHeight,
            this.iframeHtml.clientHeight,
            this.iframeHtml.scrollHeight,
            this.iframeHtml.offsetHeight
        )

        // Add 20px as a "safety margin" in case we get a horizontal scroll bar
        this.setState({ height: height + 20 })
    }

    componentWillUnmount() {
        this.heightObserver && this.heightObserver.unobserve(this.iframeHtml)
        this.heightObserver && this.heightObserver.unobserve(this.iframeBody)
    }

    render() {
        return this.props.html ? (
            <iframe
                id="html-report-id"
                srcDoc={wrapHtmlInTemplate(this.props.html)}
                title="html-report-content"
                width="100%"
                height={this.state.height}
                seamless={true}
                sandbox="allow-same-origin allow-scripts allow-modals"
                onLoad={this.onIframeLoad}
            >
                <style jsx>{`
                    iframe {
                        border: none;
                        flex-grow: 1;
                    }
                `}</style>
            </iframe>
        ) : (
            <Loader />
        )
    }
}

HtmlReport.propTypes = {
    html: PropTypes.string.isRequired,
}

export default HtmlReport
