/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { Pagination, TextField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* styles */
import styles from './Resource.style';

/* app components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue, INITIAL_PAGER } from '../../helpers/pagination';
import DOCUMENTS_ENDPOINT from './resource.conf';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

class Resource extends Page {
    constructor(props) {
        super(props);

        this.state = {
            pager: INITIAL_PAGER,
            documents: [],
            search: '',
        };
    }

    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadDocuments(INITIAL_PAGER);
    }

    loadDocuments(pager, search) {
        const api = this.props.d2.Api.getApi();
        let url = `${DOCUMENTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}&fields=displayName,id`;
        this.setState({ search });
        if (search) {
            url = `${url}&filter=displayName:ilike:${search}`;
        }
        if (api) {
            api.get(url).then((response) => {
                if (response && this.isPageMounted()) {
                    this.setState(response);
                }
            }).catch(() => {
                // TODO: manage error
            }).finally(() => {
            });
        }
    }

    /* Pagination */
    hasNextPage = () => this.state.pager.page < this.state.pager.pageCount;

    hasPreviousPage = () => this.state.pager.page > 1;

    onNextPageClick = () => {
        const pager = Object.assign({}, this.state.pager);
        pager.page += 1;
        this.loadDocuments(pager, this.state.search);
    };

    onPreviousPageClick = () => {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadDocuments(pager, this.state.search);
    };

    /* Search */
    search = (event) => {
        // ...and not empty search
        if (this.state.search !== event.target.value && /\S/.test(event.target.value)) {
            this.loadDocuments(INITIAL_PAGER, event.target.value);
        } else if (this.state.search !== event.target.value) {
            this.loadDocuments(INITIAL_PAGER);
        }
    }

    render() {
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.resource.homeLabel) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Pagination
                    total={this.state.pager.total}
                    hasNextPage={this.hasNextPage}
                    hasPreviousPage={this.hasPreviousPage}
                    onNextPageClick={this.onNextPageClick}
                    onPreviousPageClick={this.onPreviousPageClick}
                    currentlyShown={calculatePageValue(this.state.pager)}
                />
                <div id={'search-box-id'} style={styles.searchContainer}>
                    <TextField
                        value={this.state.search || ''}
                        type="search"
                        hintText={i18n.t(i18nKeys.resource.search)}
                        onBlur={this.search}
                    />
                </div>
                <Table
                    columns={['displayName']}
                    rows={this.state.documents}
                />
                <p style={
                    {
                        textAlign: 'center',
                        ...(this.state.documents.length > 0 ? { display: 'none' } : ''),
                    }
                }
                >
                    {i18n.t(i18nKeys.messages.noResultsFound)}
                </p>
                <div id={'footer-pagination-id'}>
                    <Pagination
                        total={this.state.pager.total}
                        hasNextPage={this.hasNextPage}
                        hasPreviousPage={this.hasPreviousPage}
                        onNextPageClick={this.onNextPageClick}
                        onPreviousPageClick={this.onPreviousPageClick}
                        currentlyShown={calculatePageValue(this.state.pager)}
                    />
                </div>
            </div>
        );
    }
}

Resource.childContextTypes = {
    d2: PropTypes.object,
};

export default Resource;
