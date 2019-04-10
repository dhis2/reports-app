import React from 'react'
import PropTypes from 'prop-types'
import { getContextPath } from '../utils/api'

const styleTag = `
<style>
    html {
        overflow-y: hidden;
    }
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
</style>
`

class IframeReport extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            height: 0,
        }
        this.iframeRef = React.createRef()
        this.contextPath = getContextPath()
        this.iframeHtml = this.createIframeHtml()
    }

    componentDidMount() {
        this.iframeRef.current.onload = this.setHeight
    }

    createIframeHtml() {
        const { content, withStyle, scripts } = this.props
        return `
        <html>
            <head>
            <meta charset="utf-8">
            ${scripts.map(this.createScriptTag).join('\n')}
            ${withStyle ? styleTag : ''}
            </head>
            <body>
                ${content}
            </body>
        </html>
        `
    }

    setHeight = () => {
        const iframe = this.iframeRef.current
        const height = iframe.contentWindow.document.body.offsetHeight
        this.setState({ height })
    }

    createScriptTag = script => {
        const src = this.contextPath + script
        return `<script src="${src}" type="text/javascript"></script>`
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
                srcDoc={this.iframeHtml}
                src={`data:text/html,${encodeURIComponent(this.iframeHtml)}`}
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
