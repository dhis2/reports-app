import '@dhis2/d2-ui-core/css/Pagination.css'
import '@dhis2/d2-ui-core/css/Table.css'

import { Pagination } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import Table from '@dhis2/d2-ui-table'
import i18n from '@dhis2/d2-i18n'

import {
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './standard-report/standard.report.conf'
import { ConnectedReportParams } from './standard-report/ReportParams'
import { NoResultsMessage } from '../components/NoResultsMessage'
import { SectionHeadline } from '../components/SectionHeadline'
import { Snackbar } from '../components/feedback/Snackbar'
import { displayNoResults, showContextAction } from './standard-report/helper'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    calculatePageValue,
} from '../utils/pagination/helper'
import ActionComponent from './standard-report/ActionComponent'
import AddReportButton from './standard-report/AddReportButton'
import SearchBox from './standard-report/SearchBox'
import StyledHtmlReport from './standard-report/StyledHtmlReport'
import connectStandardReport from './standard-report/connectStandardReport'
import manageError from '../utils/pageEnhancers/manageError.HOC'

export default class StandardReport extends React.Component {
    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadStandardReports(true)
    }

    render() {
        const { pager } = this.props
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount)
        const hasPreviousPage = hasPreviousPageCreator(pager.page)
        const paginationCurrentlyShown = calculatePageValue(pager)
        const contextMenuOptions = {
            [CONTEXT_MENU_ACTION.CREATE]: this.props.createReport,
            [CONTEXT_MENU_ACTION.EDIT]: this.props.editReport,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: this.props.sharingSettings,
            [CONTEXT_MENU_ACTION.DELETE]: this.props
                .requestDeleteStandardReport,
        }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Standard Report')}
                    showBackButton={!!this.props.reportData}
                    onBackClick={this.props.hideReportData}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
                />
                <div
                    id="std-report-content"
                    style={{
                        display: this.props.reportData ? 'none' : 'block',
                    }}
                >
                    <Pagination
                        total={this.props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={this.props.goToNextPage}
                        onPreviousPageClick={this.props.goToPrevPage}
                        currentlyShown={paginationCurrentlyShown}
                    />
                    <SearchBox
                        value={this.props.search}
                        onChange={this.props.setSearch}
                    />
                    <Table
                        columns={['displayName']}
                        rows={this.props.reports}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                        isContextActionAllowed={showContextAction}
                    />
                    <NoResultsMessage
                        styles={displayNoResults(
                            this.props.reports,
                            this.props.loading
                        )}
                    />
                    <div id="footer-pagination-id">
                        <Pagination
                            total={this.props.pager.total}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            onNextPageClick={this.props.goToNextPage}
                            onPreviousPageClick={this.props.goToPrevPage}
                            currentlyShown={paginationCurrentlyShown}
                        />
                    </div>
                    <AddReportButton onClick={this.props.addReportFormShow} />
                    <ActionComponent
                        d2={this.props.d2}
                        open={this.props.open}
                        selectedAction={this.props.selectedAction}
                        selectedReport={this.props.selectedReport}
                        handleClose={this.props.closeContextMenu}
                        handleError={this.manageError}
                        handleDisplayReportData={this.props.showReportData}
                        updateStandardReport={this.props.updateStandardReport}
                        addStandardReport={this.props.addStandardReport}
                    />
                </div>
                {this.props.reportData && (
                    <StyledHtmlReport reportData={this.props.reportData} />
                )}
                <ConnectedReportParams />
                <Snackbar
                    action={i18n.t('CONFIRM')}
                    onActionClick={this.props.deleteStandardReport}
                />
            </div>
        )
    }
}

StandardReport.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
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
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired,
    showReportData: PropTypes.func.isRequired,
    hideReportData: PropTypes.func.isRequired,
    closeContextMenu: PropTypes.func.isRequired,
    addReportFormShow: PropTypes.func.isRequired,
    updateStandardReport: PropTypes.func.isRequired,
    addStandardReport: PropTypes.func.isRequired,
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
}

export const ConnectedStandardReport = connectStandardReport(
    manageError(StandardReport)
)
