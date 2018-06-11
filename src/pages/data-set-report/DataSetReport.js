/* React */
import React from 'react';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import Datasets from '../../components/datasets-dropdown/DatasetsDropdown';

/* utils */
import { getDocsUrl } from '../../helpers/docs';

class DataSetReport extends Page {
    render() {
        return (
            <div>
                <h1>
                    Data Set Report
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Datasets />
            </div>
        );
    }
}

export default DataSetReport;
