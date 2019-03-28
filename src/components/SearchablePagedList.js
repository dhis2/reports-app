import i18n from '@dhis2/d2-i18n'
import { Button, Pagination, SvgIcon } from '@dhis2/d2-ui-core'
import '@dhis2/d2-ui-core/css/Pagination.css'
import '@dhis2/d2-ui-core/css/Table.css'
import Table from '@dhis2/d2-ui-table'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import css from 'styled-jsx/css'
import getPagerCurrentlyShown from '../redux/selectors/pagination/getPagerCurrentlyShown'

const searchText = i18n.t('Search')

const SearchablePagedList = props => {
    const pagination = (
        <Pagination
            total={props.pagerTotal}
            hasNextPage={props.pagerHasNextPage}
            hasPreviousPage={props.pagerHasPreviousPage}
            currentlyShown={props.pagerCurrentlyShown}
            onNextPageClick={props.goToNextPage}
            onPreviousPageClick={props.goToPrevPage}
        />
    )

    return (
        <div>
            {pagination}
            <TextField
                className="search-input"
                value={props.searchInputValue}
                type="search"
                label={searchText}
                onChange={props.searchInputChangeHandler}
            />
            <Table
                rows={props.rows}
                columns={props.columns}
                contextMenuActions={props.contextMenuActions}
                primaryAction={props.primaryAction}
                contextMenuIcons={props.contextMenuIcons}
                isContextActionAllowed={props.isContextActionAllowed}
            />
            {props.isLoading && (
                <div className="data-table-fake-row">
                    <CircularProgress size={32} className="loader" />
                </div>
            )}
            {props.rows.length === 0 && !props.isLoading && (
                <div className="data-table-fake-row">
                    {i18n.t('No results have been found')}
                </div>
            )}
            {pagination}
            <Button
                id={'add-resource-btn-id'}
                fab
                onClick={props.addButtonClickHandler}
            >
                <SvgIcon icon="Add" />
            </Button>
            <style jsx>{styles}</style>
        </div>
    )
}

const styles = css`
    div > :global(.search-input) input {
        -webkit-appearance: textfield;
    }
    div > :global(.search-input) {
        width: 400px;
    }
    div > :global(.data-table-pager) {
        float: right;
        padding-top: 8px;
    }
    div > :global(.d2-ui-button) {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
    }
    .data-table-fake-row {
        position: relative;
        height: 50px;
        line-height: 50px;
        background-color: #ffffff;
        text-align: center;
        font-style: italic;
        color: #757575;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
            0 1px 2px 0 rgba(0, 0, 0, 0.24);
    }
    .data-table-fake-row :global(.loader) {
        margin-top: 8px;
    }
`

SearchablePagedList.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    contextMenuActions: PropTypes.object.isRequired,
    primaryAction: PropTypes.func.isRequired,
    contextMenuIcons: PropTypes.object.isRequired,
    isContextActionAllowed: PropTypes.func.isRequired,
    searchInputValue: PropTypes.string.isRequired,
    searchInputChangeHandler: PropTypes.func.isRequired,
    addButtonClickHandler: PropTypes.func.isRequired,
    pagerTotal: PropTypes.number.isRequired,
    pagerHasNextPage: PropTypes.func.isRequired,
    pagerHasPreviousPage: PropTypes.func.isRequired,
    pagerCurrentlyShown: PropTypes.string.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    pagerTotal: state.pagination.total,
    pagerHasNextPage: () => state.pagination.page < state.pagination.pageCount,
    pagerHasPreviousPage: () => state.pagination.page > 1,
    pagerCurrentlyShown: getPagerCurrentlyShown(state),
})

export default connect(mapStateToProps)(SearchablePagedList)
