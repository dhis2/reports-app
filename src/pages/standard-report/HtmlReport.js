import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { loadScript } from '../../utils/dom/loadScript'

/**
 * Do this stuff inside an iframe...
 * https://stackoverflow.com/questions/10418644/creating-an-iframe-with-given-html-dynamically
 */

class HtmlReport extends Component {
    state = {
        ready: false,
        report: '',
    }

    componentDidMount() {
        loadScript('/dhis-web-commons/javascripts/jQuery/jquery.min.js')
            .then(() =>
                loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.util.js')
            )
            .then(() => this.setState({ ready: true, report: this.props.html }))
    }

    componentWillReceiveProps(newProps) {
        if (newProps.html && this.state.ready) {
            this.setState({ report: newProps.html })
        }
    }

    render() {
        return (
            <div
                id="html-report-id"
                dangerouslySetInnerHTML={{
                    __html: this.state.report,
                }}
            />
        )
    }
}

HtmlReport.propTypes = {
    html: PropTypes.string.isRequired,
}

export default HtmlReport
