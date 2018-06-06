/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { FormBuilder } from '@dhis2/d2-ui-forms';
import { SvgIcon, Button, TextField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';

/* style */
import appStyles from '../../styles';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* Utils */
import { getDocsUrl } from '../../helpers/docs';

// TODO: Check permissions
const contextMenuOptions = {
    createReport(...args) {
        this.setState(...args);
        // console.log('createReport', ...args);
    },
    editReport(...args) {
        this.setState(...args);
        // console.log('editReport', ...args);
    },
    sharingSettings(...args) {
        this.setState(...args);
        // console.log('sharingSettings', ...args);
    },
    delete(...args) {
        this.setState(...args);
        // console.log('delete', ...args);
    },
    showDetails(...args) {
        this.setState(...args);
        // console.log('showDetails', ...args);
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
    constructor() {
        super();

        this.state = {
            reportRows: [],
        };
    }
    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData();
    }

    loadData() {
        const api = this.props.d2.Api.getApi();
        if (api) {
            api.get('reports').then((response) => {
                if (response) {
                    this.setState({ reportRows: response.reports });
                }
            }).catch(() => {
                // TODO:
            });
        }
    }

    onUpdateField(fieldName, newValue) {
        if (fieldName !== newValue) {
            this.setState({ ...this.state, searchTerm: newValue });
        }
        // console.log(this.d2, fieldName, '=', newValue);
    }

    addNewReport() {
        this.setState({ loading: true });
        // console.log(this.d2, 'Add new report!');
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
                    columns={['displayName']}
                    rows={this.state.reportRows}
                    contextMenuActions={contextMenuOptions}
                    contextMenuIcons={contextMenuIcons}
                />
                <Button fab onClick={this.addNewReport} style={appStyles.addButton}>
                    <SvgIcon icon={'Add'} />
                </Button>
            </div>
        );
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
};

export default StandardReport;
