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
import getPagerCurrentlyShown from '../redux/selectors/pagination/getPagerCurrentlyShown.js'
import styles from './SearchablePagedList.module.css'

const searchText = i18n.t('Search')

const SearchablePagedList = (props) => {
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
                className={styles.searchInput}
                value={props.searchInputValue}
                type="search"
                label={searchText}
                onChange={props.searchInputChangeHandler}
            />
            <Table
                rows={props.isLoading ? [] : props.rows}
                columns={props.columns}
                contextMenuActions={props.contextMenuActions}
                primaryAction={props.primaryAction}
                contextMenuIcons={props.contextMenuIcons}
                isContextActionAllowed={props.isContextActionAllowed}
            />
            {props.isLoading && (
                <div className={styles.dataTableFakeRow}>
                    <CircularProgress size={32} className="loader" />
                </div>
            )}
            {props.rows.length === 0 && !props.isLoading && (
                <div className={styles.dataTableFakeRow}>
                    {i18n.t('No results have been found')}
                </div>
            )}
            {pagination}
            <Button
                id="add-resource-btn-id"
                fab
                onClick={props.addButtonClickHandler}
            >
                <SvgIcon icon="Add" />
            </Button>
        </div>
    )
}

SearchablePagedList.propTypes = {
    addButtonClickHandler: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    contextMenuActions: PropTypes.object.isRequired,
    contextMenuIcons: PropTypes.object.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    isContextActionAllowed: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    pagerCurrentlyShown: PropTypes.string.isRequired,
    pagerHasNextPage: PropTypes.func.isRequired,
    pagerHasPreviousPage: PropTypes.func.isRequired,
    pagerTotal: PropTypes.number.isRequired,
    primaryAction: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    searchInputChangeHandler: PropTypes.func.isRequired,
    searchInputValue: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
    pagerTotal: state.pagination.total,
    pagerHasNextPage: () => state.pagination.page < state.pagination.pageCount,
    pagerHasPreviousPage: () => state.pagination.page > 1,
    pagerCurrentlyShown: getPagerCurrentlyShown(state),
})

export default connect(mapStateToProps)(SearchablePagedList)
