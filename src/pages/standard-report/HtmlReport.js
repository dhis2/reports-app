import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getContextPath } from '../../utils/api.js'
import { CSS_FILES, SCRIPT_FILES, PAGE_STYLES } from './HtmlReportAssets.js'

const wrapHtmlInTemplate = (html) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${CSS_FILES.map(createLinkTag).join('\n')}
            ${SCRIPT_FILES.map(createScriptTag).join('\n')}
            <style type="text/css">
                ${PAGE_STYLES}
            </style>
        </head>
        <body>
            ${html}
        </body>
    </html>
`
const createScriptTag = (script) => {
    const src = getContextPath() + script
    return `<script src="${src}" type="text/javascript"></script>`
}

const createLinkTag = ({ media, styleSheet }) => {
    const href = getContextPath() + styleSheet
    return `<link type="text/css" rel="stylesheet" media="${media}" href="${href}" >`
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
    heightObserver = null

    onIframeLoad = (event) => {
        const iframeHtml = event.target.contentWindow.document.documentElement
        const iframeBody = event.target.contentWindow.document.body

        this.heightObserver = new window.ResizeObserver(this.onContentResize)
        this.heightObserver.observe(iframeHtml)
        this.heightObserver.observe(iframeBody)

        this.adjustHeight(
            iframeHtml.getBoundingClientRect(),
            iframeBody.getBoundingClientRect()
        )
    }

    onContentResize = (entries) => {
        this.adjustHeight(...entries.map((entry) => entry.contentRect))
    }

    adjustHeight = (iframeHtmlRect, iframeBodyRect) => {
        const height = Math.max(iframeHtmlRect.height, iframeBodyRect.height)

        // Add 20px as a "safety margin" in case we get a horizontal scroll bar
        this.setState({ height: Math.ceil(height) + 20 })
    }

    componentWillUnmount() {
        this.heightObserver && this.heightObserver.disconnect()
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
                sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
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
