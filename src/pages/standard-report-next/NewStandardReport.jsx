import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Checkbox,
    CircularLoader,
    FileInputField,
    InputField,
    NoticeBox,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ReportBreadcrumb } from '../../components/shell/ReportBreadcrumb.jsx'
import {
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import { reportParameterOptions } from '../../config/standardReport.js'
import { RELATIVE_PERIODS } from '../../utils/periods/relativePeriods.js'
import { cacheStrategies } from '../standard-report/standard.report.conf.js'
import { DEMO_REPORTS, isDemoReport } from './demoReports.js'
import styles from './NewStandardReport.module.css'
import { REPORT_QUERY } from './queries.js'

const basePath = sections[STANDARD_REPORT_NEXT_SECTION_KEY].path

const EMPTY = {
    name: '',
    designContent: null,
    designFileName: '',
    relativePeriods: {},
    reportParams: {},
    cacheStrategy: 'RESPECT_SYSTEM_SETTING',
}

/*
 * Creating *or* editing a standard report, as its own page rather than a
 * dialog. The fields are those the legacy add/edit form requires, less the
 * report type: Jasper is deprecated, so every report here is an HTML report.
 *
 * One form for both, because the fields are the same either way — the only
 * differences are what it opens with and what the save button claims to do.
 * With an id in the route it loads that report and fills itself in; a design
 * file is then optional, since the report already has one and leaving the
 * field alone means keeping it.
 *
 * Prototype: the form validates and then returns to the list. Nothing is
 * posted to the API yet.
 */
export const NewStandardReport = ({ match }) => {
    const history = useHistory()

    const reportId = match?.params?.id || ''
    const editing = Boolean(reportId)
    const demo = editing && isDemoReport(reportId)

    const [values, setValues] = useState(EMPTY)
    const [errors, setErrors] = useState({})

    const reportResult = useDataQuery(REPORT_QUERY, {
        variables: { id: reportId },
        lazy: !editing || demo,
    })

    const loaded = demo
        ? DEMO_REPORTS.find((report) => report.id === reportId)
        : reportResult.data?.report

    /* Fill the form in once, when the report it is editing arrives. */
    useEffect(() => {
        if (!loaded) {
            return
        }

        setValues({
            ...EMPTY,
            name: loaded.displayName || '',
            designFileName: '',
            relativePeriods: { ...(loaded.relativePeriods || {}) },
            reportParams: { ...(loaded.reportParams || {}) },
            cacheStrategy: loaded.cacheStrategy || EMPTY.cacheStrategy,
        })
    }, [loaded])

    const set = (name, value) =>
        setValues((current) => ({ ...current, [name]: value }))

    const toggle = (group, key) =>
        setValues((current) => ({
            ...current,
            [group]: { ...current[group], [key]: !current[group][key] },
        }))

    const validate = () => {
        const next = {}

        if (!values.name.trim()) {
            next.name = i18n.t('A name is required')
        }
        /* An existing report already has a design; not touching the field
         * means keeping it. */
        if (!editing && !values.designContent) {
            next.designContent = i18n.t('A design file is required')
        }
        if (!values.cacheStrategy) {
            next.cacheStrategy = i18n.t('A cache strategy is required')
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const cancel = () => history.push(basePath)

    const save = () => {
        if (validate()) {
            cancel()
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.topbar}>
                <ReportBreadcrumb
                    currentSection={STANDARD_REPORT_NEXT_SECTION_KEY}
                    leaf={
                        editing
                            ? i18n.t('Edit standard report')
                            : i18n.t('New standard report')
                    }
                />
            </header>

            <div className={styles.scroll}>
                <div className={styles.column}>
                    <h1 className={styles.title}>
                        {editing
                            ? i18n.t('Edit standard report')
                            : i18n.t('New standard report')}
                    </h1>
                    <p className={styles.lede}>
                        {editing
                            ? i18n.t(
                                  'Change what this report is called, what it asks for before it runs, and how long a generated copy may be reused. Fields marked with * are required.'
                              )
                            : i18n.t(
                                  'Register a report design so it can be run against current data. Fields marked with * are required.'
                              )}
                    </p>

                    {reportResult.loading && (
                        <div className={styles.field}>
                            <CircularLoader small />
                        </div>
                    )}

                    {reportResult.error && (
                        <div className={styles.field}>
                            <NoticeBox
                                error
                                title={i18n.t('Could not load this report')}
                            >
                                {reportResult.error.message}
                            </NoticeBox>
                        </div>
                    )}

                    {/* ---------------- identity and design ---------------- */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>
                            {i18n.t('Details')}
                        </h2>

                        <div className={styles.field}>
                            <InputField
                                required
                                label={i18n.t('Name')}
                                name="name"
                                value={values.name}
                                error={Boolean(errors.name)}
                                validationText={errors.name}
                                onChange={({ value }) => set('name', value)}
                                helpText={i18n.t(
                                    'Displayed in the standard report list.'
                                )}
                            />
                        </div>

                        <div className={styles.field}>
                            <FileInputField
                                required={!editing}
                                label={i18n.t('Design file')}
                                name="designContent"
                                buttonLabel={i18n.t('Select file')}
                                error={Boolean(errors.designContent)}
                                validationText={errors.designContent}
                                helpText={
                                    values.designFileName ||
                                    (editing
                                        ? i18n.t(
                                              'Leave this alone to keep the design the report already has.'
                                          )
                                        : i18n.t(
                                              'The HTML design file that defines the report layout.'
                                          ))
                                }
                                onChange={({ files }) => {
                                    const file = files?.[0]
                                    setValues((current) => ({
                                        ...current,
                                        designContent: file || null,
                                        designFileName: file?.name || '',
                                    }))
                                }}
                            />
                        </div>
                    </section>

                    {/* ---------------- parameters ---------------- */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>
                            {i18n.t('Report parameters')}
                        </h2>
                        <p className={styles.sectionHint}>
                            {i18n.t(
                                'Selected parameters are requested when the report is run.'
                            )}
                        </p>

                        <div className={styles.checkRow}>
                            {reportParameterOptions.map((option) => (
                                <Checkbox
                                    key={option.value}
                                    dense
                                    label={option.label}
                                    checked={Boolean(
                                        values.reportParams[option.value]
                                    )}
                                    onChange={() =>
                                        toggle('reportParams', option.value)
                                    }
                                />
                            ))}
                        </div>
                    </section>

                    {/* ---------------- relative periods ---------------- */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>
                            {i18n.t('Relative periods')}
                        </h2>
                        <p className={styles.sectionHint}>
                            {i18n.t(
                                'Restrict the periods the report may be run for. If none are selected, all periods are permitted.'
                            )}
                        </p>

                        <div className={styles.periodGroups}>
                            {RELATIVE_PERIODS.map((group) => (
                                <div
                                    className={styles.periodGroup}
                                    key={group.label}
                                >
                                    <h3 className={styles.periodGroupTitle}>
                                        {group.label}
                                    </h3>
                                    {group.options.map((option) => (
                                        <Checkbox
                                            key={option.value}
                                            dense
                                            label={option.label}
                                            checked={Boolean(
                                                values.relativePeriods[
                                                    option.value
                                                ]
                                            )}
                                            onChange={() =>
                                                toggle(
                                                    'relativePeriods',
                                                    option.value
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ---------------- settings ---------------- */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>
                            {i18n.t('Settings')}
                        </h2>

                        <div className={styles.field}>
                            <SingleSelectField
                                required
                                label={i18n.t('Cache strategy')}
                                selected={values.cacheStrategy}
                                error={Boolean(errors.cacheStrategy)}
                                validationText={errors.cacheStrategy}
                                helpText={i18n.t(
                                    'How long a generated report may be reused before it is regenerated.'
                                )}
                                onChange={({ selected }) =>
                                    set('cacheStrategy', selected)
                                }
                            >
                                {cacheStrategies.map((option) => (
                                    <SingleSelectOption
                                        key={option.value}
                                        value={option.value}
                                        label={option.label}
                                    />
                                ))}
                            </SingleSelectField>
                        </div>
                    </section>
                </div>
            </div>

            {/* The actions remain in view while the form scrolls. */}
            <footer className={styles.actions}>
                <div className={styles.actionsInner}>
                    <ButtonStrip>
                        <Button primary onClick={save}>
                            {editing
                                ? i18n.t('Save changes')
                                : i18n.t('Create report')}
                        </Button>
                        <Button secondary onClick={cancel}>
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                </div>
            </footer>
        </div>
    )
}

NewStandardReport.propTypes = {
    match: PropTypes.object,
}
