/* React */
import React from 'react';

/* Material UI */
import { Paper } from 'material-ui';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import Form from './Form';

/* utils */
import { getDocsUrl } from '../../helpers/docs';

/* styles */
import styles from '../Page.style';

class DataSetReport extends Page {
    constructor() {
        super();

        this.state = {
            showForm: true,
        };
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
                        <Form />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default DataSetReport;
