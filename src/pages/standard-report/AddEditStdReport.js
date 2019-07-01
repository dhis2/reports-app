import i18n from '@dhis2/d2-i18n'
import CircularProgress from '@dhis2/d2-ui-core/circular-progress/CircularProgress'
import Card from '@material-ui/core/Card'
import isEmpty from 'lodash.isempty'
import isEqual from 'lodash.isequal'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
// import { createSelector } from 'reselect'

import { SectionHeadline } from '../../components/SectionHeadline'
import { ReportForm } from './add-edit-report/ReportForm'
import { STANDARD_REPORT_SECTION_KEY } from '../../config/sections.config'
import {
    loadStandardReportDetails,
    navigateToList,
    sendStandardReport,
} from '../../redux/actions/standardReport'
import { loadStandardReportTables } from '../../redux/actions/standardReportTables'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { formCard, formLoader } from '../../utils/styles/shared'

export class AddEditStandardReport extends Component {
    componentDidMount() {
        const {
            edit,
            loadStandardReportDetails,
            match,
            reportTables,
            loadStandardReportTables,
        } = this.props

        if (edit) {
            loadStandardReportDetails(match.params.id)
        }
        if (reportTables.length === 0) {
            loadStandardReportTables()
        }
    }

    shouldComponentUpdate(nextProps) {
        // TODO:
        // Instead of this we should make sure the report is memoized
        // once this is done we can also remove the `lodash.isEqual` dependency
        const currProps = this.props
        const otherPropsEqual = Object.keys(nextProps).every(
            key => key === 'report' || nextProps[key] === currProps[key]
        )
        const reportEqual = isEqual(this.props.report, nextProps.report)

        return !(reportEqual && otherPropsEqual)
    }

    onSubmit = values => {
        const { sendStandardReport, edit } = this.props
        sendStandardReport(values, edit)
    }

    render() {
        const isLoading =
            isEmpty(this.props.report) || this.props.reportTables.length === 0
        const headlineText = this.props.edit
            ? i18n.t('Edit standard report')
            : i18n.t('Create standard report')

        return (
            <Fragment>
                <SectionHeadline
                    label={headlineText}
                    showBackButton={true}
                    onBackClick={this.props.navigateToList}
                    sectionKey={STANDARD_REPORT_SECTION_KEY}
                />
                <Card className={formCard.className}>
                    {isLoading ? (
                        <div className={formLoader.className}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <ReportForm
                            {...this.props}
                            backToList={this.props.navigateToList}
                            onSubmit={this.onSubmit}
                        />
                    )}
                </Card>
                {formCard.styles}
                {formLoader.styles}
            </Fragment>
        )
    }
}

AddEditStandardReport.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            mode: PropTypes.oneOf(['new', 'edit']),
            id: PropTypes.string,
        }),
    }).isRequired,
    loadStandardReportDetails: PropTypes.func.isRequired,
    loadStandardReportTables: PropTypes.func.isRequired,
    report: ReportForm.propTypes.report,
    reportTables: ReportForm.propTypes.reportTables,
    edit: ReportForm.propTypes.edit,
    sendStandardReport: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    navigateToList: PropTypes.func.isRequired,
}

// // TODO: This is not memoizing properly
// const getReport = createSelector(
//     [getEditFormInitialValues],
//     report => report
// )

const mapStateToProps = (state, props) => {
    const isEdit = props.match.params.mode === 'edit'
    return {
        reportTables: state.standardReportTables.collection,
        report: getEditFormInitialValues(state, isEdit),
        edit: isEdit,
    }
}

const ConnectedComponent = connect(
    mapStateToProps,
    {
        loadStandardReportDetails,
        loadStandardReportTables,
        sendStandardReport,
        navigateToList,
    }
)(AddEditStandardReport)

export { ConnectedComponent as ConnectedAddEditStdReport }
