import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getContextPath } from '../../utils/api.js'
import { CSS_FILES, SCRIPT_FILES, PAGE_STYLES } from './HtmlReportAssets.js'
import styles from './HtmlReport.module.css'

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
    <div className={styles.loader}>
        <CircularProgress />
    </div>
)

class HtmlReport extends Component {
    state = { height: 'auto' }
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
        this.setState({ height: Math.ceil(height) + 20 }) // safety margin
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
                className={styles.iframe}
                sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
                onLoad={this.onIframeLoad}
            />
        ) : (
            <Loader />
        )
    }
}

HtmlReport.propTypes = {
    html: PropTypes.string.isRequired,
}

export default HtmlReport
