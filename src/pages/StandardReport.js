import React from 'react'
import PropTypes from 'prop-types'
import Table from '@dhis2/d2-ui-table'
import '@dhis2/d2-ui-core/build/css/Table.css'
import '@dhis2/d2-ui-core/build/css/Pagination.css'
import { Pagination } from '@dhis2/d2-ui-core'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import SearchBox from './standard-report/SearchBox'
import { NoResultsMessage } from '../components/NoResultsMessage'
import AddReportButton from './standard-report/AddReportButton'
import ActionComponent from './standard-report/ActionComponent'
import StyledHtmlReport from './standard-report/StyledHtmlReport'
import {
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './standard-report/standard.report.conf'
import { displayNoResults, showContextAction } from './standard-report/helper'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    calculatePageValue,
} from '../utils/pagination/helper'
import connectStandardReport from './standard-report/connectStandardReport'
import i18n from '../utils/i18n/locales'

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
        reportData: PropTypes.string.isRequired,
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
        const paginationCurrentlyShown = calculatePageValue(pager)
        const contextMenuOptions = {
            [CONTEXT_MENU_ACTION.CREATE]: props.createReport,
            [CONTEXT_MENU_ACTION.EDIT]: props.editReport,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: props.sharingSettings,
            [CONTEXT_MENU_ACTION.DELETE]: props.requestDeleteStandardReport,
        }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Standard Report')}
                    showBackButton={!!props.reportData}
                    onBackClick={props.hideReportData}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <div
                    id="std-report-content"
                    style={{ display: props.reportData ? 'none' : 'block' }}
                >
                    <Pagination
                        total={props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={props.goToNextPage}
                        onPreviousPageClick={props.goToPrevPage}
                        currentlyShown={paginationCurrentlyShown}
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
                    <div id="footer-pagination-id">
                        <Pagination
                            total={props.pager.total}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            onNextPageClick={props.goToNextPage}
                            onPreviousPageClick={props.goToPrevPage}
                            currentlyShown={paginationCurrentlyShown}
                        />
                    </div>
                    <AddReportButton onClick={props.addReportFormShow} />
                    <ActionComponent
                        d2={props.d2}
                        open={props.open}
                        selectedAction={props.selectedAction}
                        selectedReport={props.selectedReport}
                        handleClose={props.closeContextMenu}
                        handleError={this.manageError}
                        handleDisplayReportData={props.showReportData}
                    />
                </div>
                {props.reportData && (
                    <StyledHtmlReport reportData={props.reportData} />
                )}
                <Snackbar onActionClick={props.deleteStandardReport} />
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
