/* React */
import React from 'react';

/* Material UI */
import { Paper } from 'material-ui';

/* js-xlsx */
import XLSX from 'xlsx';

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
        /*        this.props.updateAppState({
            showSnackbar: true,
        }); */
    }

    onSuccess = (reportHtml) => {
        this.setState({
            reportHtml,
        });
    }

    onError = () => {

    }

    exportReportToXls = () => {
        const reportTables = document.querySelectorAll('#report-container table');
        const workbook = XLSX.utils.book_new();
        for (let i = 0; i < reportTables.length; i++) {
            const worksheet = XLSX.utils.table_to_sheet(reportTables[i]);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${i}`);
        }
        XLSX.writeFile(workbook, 'report.xlsx');
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
                            onError={this.onError}
                            exportReportToXls={this.exportReportToXls}
                        />
                    </div>
                    { this.state.reportHtml &&
                        <div id="report-container">
                            <Report reportHtml={this.state.reportHtml} />
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}

export default DataSetReport;
