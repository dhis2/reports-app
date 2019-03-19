import React, { Component } from 'react'

/**
 * Do this stuff inside an iframe...
 * https://stackoverflow.com/questions/10418644/creating-an-iframe-with-given-html-dynamically
 */

class HtmlReport extends Component {
    reportContainer = null

    state = {
        ready: false,
    }

    // TODO: Fix urls/paths to scripts or find a better way to do this
    componentDidMount() {
        const jqueryScript = document.createElement('script')
        jqueryScript.type = 'text/javascript'
        jqueryScript.src =
            '../dhis-web-commons/javascripts/jQuery/jquery.min.js'

        const jQueryPromise = new Promise(resolve => {
            jqueryScript.onload = resolve
        })

        jQueryPromise.then(this.loadDHIS2Script).then(() => {
            this.setState({ ready: true }, () =>
                this.renderReport(this.props.html)
            )
        })

        document.head.appendChild(jqueryScript)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.html && this.state.ready) {
            this.renderReport(newProps.html)
        }
    }

    renderReport(report) {
        const domFrag = document.createRange().createContextualFragment(report)
        this.reportContainer.innerHTML = ''
        this.reportContainer.appendChild(domFrag)
    }

    loadDHIS2Script = () => {
        const dhis2Script = document.createElement('script')
        dhis2Script.type = 'text/javascript'
        dhis2Script.src = '../dhis-web-commons/javascripts/dhis2/dhis2.util.js'
        document.head.appendChild(dhis2Script)

        return new Promise(resolve => {
            dhis2Script.onload = resolve
        })
    }

    render() {
        return (
            <div
                ref={ref => (this.reportContainer = ref)}
                id="html-report-id"
            />
        )
    }
}

export default HtmlReport
