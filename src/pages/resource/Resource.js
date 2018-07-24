import PropTypes from 'prop-types';
/* React */
import React from 'react';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';

/* app components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { INITIAL_PAGER } from '../../helpers/pagination';
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
        const url = `${DOCUMENTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}` +
            '&fields=displayName,id';
        this.setState({ search });
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

    render() {
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.resource.homeLabel) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
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
            </div>
        );
    }
}

Resource.childContextTypes = {
    d2: PropTypes.object,
};

export default Resource;
