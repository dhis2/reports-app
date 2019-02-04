import React from 'react'
import PropTypes from 'prop-types'
import Table from '@dhis2/d2-ui-table'
import '@dhis2/d2-ui-core/build/css/Table.css'
import '@dhis2/d2-ui-core/build/css/Pagination.css'
import manageError from './manageError.HOC'
import Feedback from '../components/Feedback'
import Headline from './standard-report/Headline'
import SearchBox from './standard-report/SearchBox'
import NoResultsMessage from './standard-report/NoResultsMessage'
import AddReportButton from './standard-report/AddReportButton'
import StandardReportPagination from './standard-report/StandardReportPagination'
import ActionComponent from './standard-report/ActionComponent'
import StyledHtmlReport from './standard-report/StyledHtmlReport'
import {
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './standard-report/standard.report.conf'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    displayNoResults,
    showContextAction,
    createFeedbackConf,
} from './standard-report/helper'
import connectStandardReport from './standard-report/connectStandardReport'

export default class StandardReport extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        showFeedback: PropTypes.bool.isRequired,
        feedbackConf: PropTypes.object.isRequired,
        pager: PropTypes.object.isRequired,
        reports: PropTypes.array.isRequired,
        selectedReport: PropTypes.object.isRequired,
        selectedAction: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        open: PropTypes.bool.isRequired,
        htmlReport: PropTypes.string.isRequired,
        loadStandardReports: PropTypes.func.isRequired,
        createReport: PropTypes.func.isRequired,
        editReport: PropTypes.func.isRequired,
        deleteStandardReport: PropTypes.func.isRequired,
        sharingSettings: PropTypes.func.isRequired,
        requestDeleteStandardReport: PropTypes.func.isRequired,
    }

    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadStandardReports()
    }

    render() {
        const { props } = this
        const { pager } = props
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount)
        const hasPreviousPage = hasPreviousPageCreator(pager.page)
        const contextMenuOptions = {
            [CONTEXT_MENU_ACTION.CREATE]: props.createReport,
            [CONTEXT_MENU_ACTION.EDIT]: props.editReport,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: props.sharingSettings,
            [CONTEXT_MENU_ACTION.DELETE]: props.requestDeleteStandardReport,
        }

        return (
            <div>
                <Headline
                    showBackButton={!!props.htmlReport}
                    onGoBackClick={props.hideHtmlReport}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <div
                    id="std-report-content"
                    style={{ display: props.htmlReport ? 'none' : 'block' }}
                >
                    <StandardReportPagination
                        total={props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={props.goToNextPage}
                        onPreviousPageClick={props.goToPrevPage}
                        pager={props.pager}
                    />
                    <SearchBox
                        value={props.search}
                        onChange={props.setSearch}
                    />
                    <Table
                        columns={['displayName', 'reportTable', 'id']}
                        rows={props.reports}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                        isContextActionAllowed={showContextAction}
                    />
                    <NoResultsMessage
                        styles={displayNoResults(props.reports, props.loading)}
                    />
                    <StandardReportPagination
                        total={props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={props.goToNextPage}
                        onPreviousPageClick={props.goToPrevPage}
                        pager={props.pager}
                    />
                    <AddReportButton onClick={props.addReportFormShow} />
                    <ActionComponent
                        d2={props.d2}
                        open={props.open}
                        selectedAction={props.selectedAction}
                        selectedReport={props.selectedReport}
                        handleClose={props.closeContextMenu}
                        handleError={this.manageError}
                        handleDisplayHtmlReport={props.showHtmlReport}
                    />
                </div>
                {props.htmlReport && (
                    <StyledHtmlReport htmlReport={props.htmlReport} />
                )}
                <Feedback
                    open={props.showFeedback}
                    conf={createFeedbackConf(props)}
                />
            </div>
        )
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
}

export const ConnectedStandardReport = connectStandardReport(
    manageError(StandardReport)
)
