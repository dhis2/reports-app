import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Dialog } from 'material-ui'
import { Button } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import { Form } from 'react-final-form'
import appStyles from '../../utils/styles'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { File } from '../../components/form/File'
import { CheckBoxGroups } from '../../components/form/CheckBoxGroups'
import { CheckBoxes } from '../../components/form/CheckBoxes'
import { relativePeriods } from '../../utils/periods/relativePeriods'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import {
    reportTypes,
    reportTypeOptions,
    cacheStrategies,
} from './standard.report.conf'
import styles from './add-edit-report/AddEditStdReport.style'
import { DesignFileDownloadButton } from './add-edit-report/DesignFileDownloadButton'
import {
    validateNewReport,
    validateReportUpdate,
} from './add-edit-report/validate'

export const Component = props => (
    <Dialog
        modal
        autoDetectWindowHeight
        autoScrollBodyContent
        open={props.open}
        title={props.edit ? 'Edit report' : 'Add report'}
        contentStyle={styles.dialog}
    >
        <Form
            onSubmit={props.onSubmit}
            validate={props.edit ? validateReportUpdate : validateNewReport}
            initialValues={props.selectedReport}
        >
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <section>
                        <h2>Details</h2>
                        <Input name="name" placeholder={i18n.t('Name*')} />
                        <Select
                            name="type"
                            placeholder={i18n.t('Report Type*')}
                            options={reportTypeOptions}
                        />
                        <File
                            name="designContent"
                            placeholder={i18n.t('Design File*')}
                        />
                        <DesignFileDownloadButton
                            isEditing={!!props.selectedReport}
                            reportType={values.type}
                            reportId={
                                props.edit
                                    ? console.log(props.selectedReport) ||
                                      props.selectedReport.id
                                    : ''
                            }
                        />
                        {values.type === reportTypes.JASPER_REPORT_TABLE && (
                            <Select
                                name="reportTable"
                                placeholder={i18n.t('Report Table*')}
                                options={props.reportTables || []}
                            />
                        )}
                    </section>
                    {values.type !== reportTypes.JASPER_REPORT_TABLE && (
                        <section>
                            <h2>Relative Periods*</h2>
                            <CheckBoxGroups
                                name="relativePeriod"
                                groups={relativePeriods}
                            />

                            <h2>Report parameters</h2>
                            <CheckBoxes
                                name="reportParams"
                                options={[
                                    {
                                        value: 'paramReportingPeriod',
                                        label: 'Reporting Period',
                                    },
                                    {
                                        value: 'paramOrganisationUnit',
                                        label: 'Organisation Unit',
                                    },
                                ]}
                            />
                        </section>
                    )}
                    <section>
                        <h2>Settings</h2>
                        <Select
                            name="cacheStrategy"
                            placeholder={i18n.t('Cache Strategy*')}
                            options={cacheStrategies}
                        />
                    </section>
                    <section>
                        <Button
                            raised
                            color="primary"
                            type="submit"
                            onClick={handleSubmit}
                            style={appStyles.dialogBtn}
                        >
                            Submit
                        </Button>
                        <Button
                            raised
                            type="submit"
                            onClick={() => props.onRequestClose(false)}
                            style={appStyles.dialogBtn}
                        >
                            Cancel
                        </Button>
                    </section>
                </form>
            )}
        </Form>
    </Dialog>
)

Component.propTypes = {
    open: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    selectedReport: PropTypes.object.isRequired,
    reportTables: Select.propTypes.options,
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    reportTables: state.standardReportTables.collection,
    selectedReport: getEditFormInitialValues(state),
})

const ConnectedComponent = connect(mapStateToProps)(Component)

export { ConnectedComponent as ConnectedAddEditStdReport }
