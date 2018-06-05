/* React */
import React from 'react';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* utils */
import { getDocsUrl } from '../../helpers/docs';

class DataApproval extends Page {
    render() {
        return (
            <h1>
                Data Approval
                <PageHelper
                    url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                />
            </h1>
        );
    }
}

export default DataApproval;
