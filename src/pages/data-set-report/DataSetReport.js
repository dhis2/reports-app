/* React */
import React from 'react';

/* Material UI */
import { Paper } from 'material-ui';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import Form from './Form';
import Report from './Report';

/* utils */
import { getDocsUrl } from '../../helpers/docs';

/* styles */
import styles from '../Page.style';

class DataSetReport extends Page {
    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
        };
    }

    onBeforeSubmit = () => {
        this.props.updateAppState({
            showSnackbar: true,
        });
    }

    onSuccess = (reportHtml) => {
        this.setState({
            reportHtml,
        });
    }

    render() {
        return (
            <div>
                <h1>
                    Data Set Report
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <Form
                            onBeforeSubmit={this.onBeforeSubmit}
                            onSuccess={this.onSuccess}
                        />
                    </div>
                    { this.state.reportHtml &&
                        <div className="report">
                            <Report reportHtml={this.state.reportHtml} />
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}

export default DataSetReport;
