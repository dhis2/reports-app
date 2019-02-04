import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from '@dhis2/d2-ui-core'
import { calculatePageValue } from '../../utils/pagination'
import appStyles from '../../utils/styles'

const StandardReportPagination = props => (
    <div id={'footer-pagination-id'} style={appStyles.marginForAddButton}>
        <Pagination
            total={props.total}
            hasNextPage={props.hasNextPage}
            hasPreviousPage={props.hasPreviousPage}
            onNextPageClick={props.onNextPageClick}
            onPreviousPageClick={props.onPreviousPageClick}
            currentlyShown={calculatePageValue(props.pager)}
        />
    </div>
)

StandardReportPagination.propTypes = {
    total: PropTypes.number.isRequired,
    hasNextPage: PropTypes.func.isRequired,
    hasPreviousPage: PropTypes.func.isRequired,
    onNextPageClick: PropTypes.func.isRequired,
    onPreviousPageClick: PropTypes.func.isRequired,
    pager: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
}

export default StandardReportPagination
