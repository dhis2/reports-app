import React from 'react'
import PropTypes from 'prop-types'
import { getContextPath } from '../utils/api'

const LOADING_DONE = 'DHIS2_REPORTS_APP_IFRAME_CONTENT_LOADING_DONE'
const ADDITIONAL_STYLE_RULES = `
body {
    font-family: 'Roboto', sans-serif;
}
table {
    border-collapse: collapse;
}
th, td {
    border: 1px solid #bcbcbc;
    padding: 4px;
}
`

class IframeReport extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            height: 0,
        }
        this.iframeRef = React.createRef()
        this.onIframeContentLoaded = this.onIframeContentLoaded.bind(this)
        this.createScriptTag = this.createScriptTag.bind(this)
    }

    componentDidMount() {
        this.initIframe()
        window.addEventListener('message', this.onIframeContentLoaded)
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onIframeContentLoaded)
    }

    initIframe = () => {
        const iframeDoc = this.iframeRef.current.contentWindow.document
        iframeDoc.head.innerHTML = this.createHeadHtml()
        iframeDoc.body.innerHTML = this.createBodyHtml()
    }

    onIframeContentLoaded(event) {
        if (event.data === LOADING_DONE) {
            this.setHeight()
        }
    }

    createHeadHtml() {
        return `
            <meta charset="utf-8">
            ${this.props.scripts.map(this.createScriptTag).join('\n')}
            ${this.createStyleTag()}
        `
    }

    createScriptTag(script) {
        const src = getContextPath() + script
        return `<script src="${src}" type="text/javascript"></script>`
    }

    createStyleTag() {
        return `
        <style>
            html {
                overflow-y: hidden;
            }
            ${this.props.withStyle ? ADDITIONAL_STYLE_RULES : ''}
        </style>
        `
    }

    createBodyHtml() {
        const { content } = this.props
        /*
         * This is where the magic happens: this image is the last
         * child of the body, so in theory it should load last.
         * When it does, it will post a message to the top window to
         * let that know all content has loaded. At that point setHeight
         * is called and this should now get the correct content height value.
         */
        return `
            ${content}
            <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                onload="window.top.postMessage('${LOADING_DONE}', '*');this.parentNode.removeChild(this);">
        `
    }

    setHeight() {
        const iframe = this.iframeRef.current
        const height = iframe.contentWindow.document.body.offsetHeight
        this.setState({ height })
    }

    render() {
        return (
            <iframe
                ref={this.iframeRef}
                title={this.props.title}
                name={this.props.title}
                height={this.state.height}
                width="100%"
                seamless={true}
                sandbox="allow-same-origin allow-scripts"
            />
        )
    }
}

IframeReport.propTypes = {
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    withStyle: PropTypes.bool,
    scripts: PropTypes.array,
}

IframeReport.defaultProps = {
    withStyle: false,
    scripts: [],
}

export default IframeReport
