import React, { Component } from 'react';

class HtmlReport extends Component {
    // TODO: Fix urls/paths to scripts or find a better way to do this
    componentDidMount() {
        const jqueryScript = document.createElement('script');
        jqueryScript.type = 'text/javascript';
        // jqueryScript.src = 'http://localhost:8080/dhis-web-commons/javascripts/jQuery/jquery.min.js';
        jqueryScript.src = '../dhis-web-commons/javascripts/jQuery/jquery.min.js';
        jqueryScript.onload = () => {
            this.loadDHIS2Script();
        };
        document.head.appendChild(jqueryScript);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.html) {
            const domFrag = document.createRange().createContextualFragment(newProps.html);
            document.getElementById('html-report-id').innerHTML = '';
            document.getElementById('html-report-id').appendChild(domFrag);
        }
    }

    loadDHIS2Script = () => {
        const dhis2Script = document.createElement('script');
        dhis2Script.type = 'text/javascript';
        // dhis2Script.src = 'http://localhost:8080/dhis-web-commons/javascripts/dhis2/dhis2.util.js';
        dhis2Script.src = '../dhis-web-commons/javascripts/dhis2/dhis2.util.js';
        document.head.appendChild(dhis2Script);
    };

    render() {
        return (
            <div id={'html-report-id'} />
        );
    }
}

export default HtmlReport;
