/*
 * "As seen in data entry" output for a data set report.
 *
 * Section and default forms are rendered by the Aggregate Data Entry app's own
 * layout components (see vendor/), fed report numbers rather than data entry
 * numbers. Custom forms keep the server-rendered HTML the report endpoint
 * already returns, since that arrives with the values in place.
 *
 * Everything this view shows comes from the same response Standard view shows,
 * so the two can never disagree about a figure, and sub-unit aggregation and
 * dimension filters are honoured because the server applied them before we saw
 * the data.
 */
import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { buildValueIndex } from './buildValueIndex.js'
import styles from './FormView.module.css'
import { resolveValues } from './resolveValues.js'
import { FormMetadataContext } from './shared/FormMetadataContext.js'
import { useFormMetadataQuery } from './shared/useFormMetadataQuery.js'
import { ReportValueContext, createValueState } from './shared/useValueStore.js'
import { DefaultForm } from './vendor/default-form.jsx'
import { SectionForm } from './vendor/section-form/section-form.jsx'
import * as selectors from './vendor/selectors.js'

const FORM_TYPES = {
    DEFAULT: 'DEFAULT',
    SECTION: 'SECTION',
    CUSTOM: 'CUSTOM',
}

/*
 * The vendored components take the data set in the shape the metadata store
 * holds it: sections inline, renderAsTabs, displayOptions. That is not the
 * shape the page's own data set query returns, so it is read back out of the
 * metadata rather than passed in.
 */
const FormBody = ({ dataSetId }) => {
    const { data: metadata } = React.useContext(FormMetadataContext)
    const dataSet = selectors.getDataSetById(metadata, dataSetId)

    if (!dataSet) {
        return (
            <NoticeBox
                warning
                title={i18n.t('This data set is not available for form view')}
            >
                {i18n.t(
                    'The form structure for this data set was not returned by the server. This usually means the data set is not assigned to any organisation unit.'
                )}
            </NoticeBox>
        )
    }

    if (dataSet.formType === FORM_TYPES.SECTION) {
        return <SectionForm dataSet={dataSet} globalFilterText="" />
    }

    return <DefaultForm dataSet={dataSet} globalFilterText="" />
}

FormBody.propTypes = {
    dataSetId: PropTypes.string.isRequired,
}

export const FormView = ({ dataSetId, grids }) => {
    const { called, loading, error, metadata, fetch } = useFormMetadataQuery()
    const { show: showUnmatchedWarning } = useAlert(
        ({ message }) => message,
        () => ({ warning: true })
    )

    /* Lazy: nothing is fetched until someone actually asks for Form view. */
    useEffect(() => {
        if (!called) {
            fetch()
        }
    }, [called, fetch])

    const nameIndex = useMemo(() => buildValueIndex(grids), [grids])

    const { values, matched, unmatched } = useMemo(
        () => resolveValues({ nameIndex, metadata, dataSetId }),
        [nameIndex, metadata, dataSetId]
    )

    const valueState = useMemo(() => createValueState(values), [values])
    const metadataContext = useMemo(() => ({ data: metadata }), [metadata])

    /*
     * Name matching is the one part of this that can fail quietly: an
     * unmatched figure renders as an empty cell and looks like missing data.
     * Say so rather than letting someone read a wrong total off a printout.
     */
    useEffect(() => {
        if (unmatched > 0) {
            showUnmatchedWarning({
                message: i18n.t(
                    '{{count}} values from this report could not be placed in the form and are not shown. Standard view shows all of them.',
                    { count: unmatched }
                ),
            })
        }
    }, [unmatched, showUnmatchedWarning])

    if (loading || !called) {
        return (
            <div className={styles.loading}>
                <CircularLoader small />
                <span>{i18n.t('Loading form layout…')}</span>
            </div>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Form view is not available')}>
                {i18n.t(
                    'The form layout could not be loaded. Form view needs DHIS2 2.39 or later. Standard view still works.'
                )}
            </NoticeBox>
        )
    }

    return (
        <FormMetadataContext.Provider value={metadataContext}>
            <ReportValueContext.Provider value={valueState}>
                <div className={styles.form}>
                    {matched === 0 && (
                        <NoticeBox title={i18n.t('Showing an empty form')}>
                            {i18n.t(
                                'No values from this report appear in the form below. The form is shown as it looks in data entry, with every field blank.'
                            )}
                        </NoticeBox>
                    )}
                    <FormBody dataSetId={dataSetId} />
                </div>
            </ReportValueContext.Provider>
        </FormMetadataContext.Provider>
    )
}

FormView.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    grids: PropTypes.array,
}
