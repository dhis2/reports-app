/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { FormBuilder } from '@dhis2/d2-ui-forms';
import { TextField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* Utils */
import { getDocsUrl } from '../../helpers/docs';

const myRows = [
    { name: 'ANC: 1st Visit Cumulative Chart' },
    { name: 'ANC: Coverages This Year' },
];

// TODO: Check permissions
const contextMenuOptions = {
    createReport(...args) {
        console.log('createReport', ...args);
    },
    editReport(...args) {
        console.log('editReport', ...args);
    },
    sharingSettings(...args) {
        console.log('sharingSettings', ...args);
    },
    delete(...args) {
        console.log('delete', ...args);
    },
    showDetails(...args) {
        console.log('showDetails', ...args);
    },
};

const contextMenuIcons = {
    createReport: 'arrow_right',
    editReport: 'edit',
    sharingSettings: 'people',
    remove: 'delete',
    showDetails: 'info',
};

class StandardReport extends Page {
    getChildContext() {
        return { d2: this.props.d2 };
    }

    onUpdateField(fieldName, newValue) {
        console.log(this.d2, fieldName, '=', newValue);
    }

    render() {
        const fields = [
            {
                name: 'searchField',
                component: TextField,
                props: {
                    floatingLabelText: 'Search',
                    style: {
                        width: '100%',
                        marginTop: '0px',
                    },
                    changeEvent: 'onBlur',
                    type: 'search',
                },
            },
        ];
        return (
            <div>
                <h1>
                    Standard Report
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <div id={'search-box-id'} style={{ backgroundColor: '#ffffff' }}>
                    <FormBuilder
                        style={{ backgroundColor: '#ffffff', width: '33%', paddingLeft: '1.6rem' }}
                        fields={fields}
                        onUpdateField={this.onUpdateField}
                    />
                </div>
                <Table
                    columns={['name']}
                    rows={myRows}
                    contextMenuActions={contextMenuOptions}
                    contextMenuIcons={contextMenuIcons}
                />
            </div>
        );
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
};

export default StandardReport;
