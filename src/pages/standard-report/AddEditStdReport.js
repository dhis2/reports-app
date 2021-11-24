import i18n from '@dhis2/d2-i18n'
import { Card, CircularProgress } from '@material-ui/core'
import isEmpty from 'lodash.isempty'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { SectionHeadline } from '../../components/SectionHeadline.js'
import { STANDARD_REPORT_SECTION_KEY } from '../../config/sections.config.js'
import {
    loadStandardReportDetails,
    navigateToList,
    sendStandardReport,
} from '../../redux/actions/standardReport.js'
import {
    getEditFormInitialValues,
    getIsEdit,
} from '../../redux/selectors/standardReport/getEditFormInitialValues.js'
import { formCard, formLoader } from '../../utils/styles/shared.js'
import { ReportForm } from './add-edit-report/ReportForm.js'

export class AddEditStandardReport extends PureComponent {
    componentDidMount() {
        const { edit, loadStandardReportDetails, match } = this.props

        if (edit) {
            loadStandardReportDetails(match.params.id)
        }
    }

    onSubmit = (values) => {
        const { sendStandardReport, edit } = this.props
        sendStandardReport(values, edit)
    }

    render() {
        const isLoading = isEmpty(this.props.report)
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
}

const mapStateToProps = (state) => {
    return {
        report: getEditFormInitialValues(state),
        edit: getIsEdit(state),
    }
}

const ConnectedComponent = connect(mapStateToProps, {
    loadStandardReportDetails,
    sendStandardReport,
    navigateToList,
})(AddEditStandardReport)

export { ConnectedComponent as ConnectedAddEditStdReport }
