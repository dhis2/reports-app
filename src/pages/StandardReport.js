import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import {
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './standard-report/standard.report.conf'
import { ConnectedReportParams } from './standard-report/ReportParams'
import {
    STANDARD_REPORT_SECTION_KEY,
    sections,
} from '../config/sections.config'
import { SectionHeadline } from '../components/SectionHeadline'
import { Snackbar } from '../components/feedback/Snackbar'
import { showContextAction } from './standard-report/helper'
import SearchablePagedList from '../components/SearchablePagedList'
import StandardReportActions from './standard-report/StandardReportActions'
import connectStandardReport from './standard-report/connectStandardReport'

const createContextMenuOptions = props => ({
    [CONTEXT_MENU_ACTION.CREATE]: props.createReport,
    [CONTEXT_MENU_ACTION.EDIT]: props.editReport,
    [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: props.sharingSettings,
    [CONTEXT_MENU_ACTION.DELETE]: props.requestDeleteStandardReport,
})

class StandardReport extends React.Component {
    constructor(props) {
        super(props)
        this.contextMenuOptions = createContextMenuOptions(props)
    }

    componentDidMount() {
        if (this.props.reports.length === 0) {
            this.props.loadStandardReports(true)
        }
    }

    render() {
        return (
            <div>
                <SectionHeadline
                    label={sections[STANDARD_REPORT_SECTION_KEY].info.label}
                    showBackButton={!!this.props.reportData}
                    onBackClick={this.props.hideReportData}
                    sectionKey={STANDARD_REPORT_SECTION_KEY}
                />
                <div id="std-report-content">
                    <SearchablePagedList
                        columns={['displayName']}
                        rows={this.props.reports}
                        isLoading={this.props.loading}
                        contextMenuActions={this.contextMenuOptions}
                        primaryAction={
                            this.contextMenuOptions[
                                [CONTEXT_MENU_ACTION.CREATE]
                            ]
                        }
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                        isContextActionAllowed={showContextAction}
                        searchInputValue={this.props.search}
                        searchInputChangeHandler={this.props.setSearch}
                        addButtonClickHandler={this.props.addReportFormShow}
                        goToNextPage={this.props.goToNextPage}
                        goToPrevPage={this.props.goToPrevPage}
                    />
                    <StandardReportActions
                        open={this.props.open}
                        selectedAction={this.props.selectedAction}
                        selectedReport={this.props.selectedReport}
                        handleClose={this.props.closeContextMenu}
                        handleDisplayReportData={this.props.showReportData}
                    />
                </div>
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
    addReportFormShow: PropTypes.func.isRequired,
    closeContextMenu: PropTypes.func.isRequired,
    deleteStandardReport: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    hideReportData: PropTypes.func.isRequired,
    loadStandardReports: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    reportData: PropTypes.string.isRequired,
    reports: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedReport: PropTypes.object.isRequired,
    setSearch: PropTypes.func.isRequired,
    showReportData: PropTypes.func.isRequired,
}

const ConnectedStandardReport = connectStandardReport(StandardReport)

export { ConnectedStandardReport as StandardReport }
