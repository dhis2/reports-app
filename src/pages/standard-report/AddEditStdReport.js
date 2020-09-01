import i18n from '@dhis2/d2-i18n'
import { Card, CircularProgress } from '@material-ui/core'
import isEmpty from 'lodash.isempty'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { SectionHeadline } from '../../components/SectionHeadline'
import { STANDARD_REPORT_SECTION_KEY } from '../../config/sections.config'
import {
    loadStandardReportDetails,
    navigateToList,
    sendStandardReport,
} from '../../redux/actions/standardReport'
import { loadStandardReportTables } from '../../redux/actions/standardReportTables'
import {
    getEditFormInitialValues,
    getIsEdit,
} from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { formCard, formLoader } from '../../utils/styles/shared'
import { ReportForm } from './add-edit-report/ReportForm'

export class AddEditStandardReport extends PureComponent {
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
    loadStandardReportDetails: PropTypes.func.isRequired,
    loadStandardReportTables: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
            mode: PropTypes.oneOf(['new', 'edit']),
        }),
    }).isRequired,
    navigateToList: PropTypes.func.isRequired,
    sendStandardReport: PropTypes.func.isRequired,
    edit: ReportForm.propTypes.edit,
    report: ReportForm.propTypes.report,
    reportTables: ReportForm.propTypes.reportTables,
}

const mapStateToProps = state => {
    return {
        reportTables: state.standardReportTables.collection,
        report: getEditFormInitialValues(state),
        edit: getIsEdit(state),
    }
}

const ConnectedComponent = connect(mapStateToProps, {
    loadStandardReportDetails,
    loadStandardReportTables,
    sendStandardReport,
    navigateToList,
})(AddEditStandardReport)

export { ConnectedComponent as ConnectedAddEditStdReport }
