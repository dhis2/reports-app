/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { Pagination, SvgIcon, Button, TextField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* style */
import appStyles from '../../styles';
import styles from './StandardReport.style';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* Utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue, INITIAL_PAGER } from '../../helpers/pagination';


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

const REPORTS_ENDPOINT = 'reports';

class StandardReport extends Page {
    constructor(props) {
        super(props);

        this.state = {
            pager: INITIAL_PAGER,
            reports: [],
            search: '',
        };

        this.hasNextPage = this.hasNextPage.bind(this);
        this.hasPreviousPage = this.hasPreviousPage.bind(this);
        this.search = this.search.bind(this);
        this.addNewReport = this.addNewReport.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
    }

    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData(INITIAL_PAGER);
    }

    loadData(pager, search) {
        const api = this.props.d2.Api.getApi();
        let url = `${REPORTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}`;
        this.setState({ search });
        if (search && /\S/.test(search)) {
            url = `${url}&filter=displayName:ilike:${search}`;
        }
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState(response);
                }
            }).catch(() => {
                // TODO:
            });
        }
    }

    hasNextPage() {
        return this.state.pager.page < this.state.pager.pageCount;
    }

    hasPreviousPage() {
        return this.state.pager.page > 1;
    }

    onNextPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page += 1;
        this.loadData(pager);
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadData(pager);
    }

    search(event) {
        if (this.state.search !== event.target.value) {
            this.loadData(INITIAL_PAGER, event.target.value);
        }
    }

    // TODO: implement
    addNewReport() {
        this.setState({ loading: true });
        // console.log(this.d2, 'Add new report!');
    }

    render() {
        return (
            <div>
                <h1>
                    Standard Report
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <div id={'search-box-id'} style={styles.searchContainer}>
                    <TextField
                        value={this.state.search || ''}
                        type="search"
                        hintText="Search"
                        onBlur={this.search}
                    />
                </div>
                <Table
                    columns={['displayName']}
                    rows={this.state.reports}
                    contextMenuActions={contextMenuOptions}
                    contextMenuIcons={contextMenuIcons}
                />
                <div id={'footer-pagination-id'} style={appStyles.marginForAddButton}>
                    <Pagination
                        total={this.state.pager.total}
                        hasNextPage={this.hasNextPage}
                        hasPreviousPage={this.hasPreviousPage}
                        onNextPageClick={this.onNextPageClick}
                        onPreviousPageClick={this.onPreviousPageClick}
                        currentlyShown={calculatePageValue(this.state.pager)}
                    />
                </div>
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
