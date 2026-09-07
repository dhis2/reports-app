import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Checkbox,
    FileInputField,
    InputField,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ReportBreadcrumb } from '../../components/shell/ReportBreadcrumb.jsx'
import {
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import { reportParameterOptions } from '../../config/standardReport.js'
import { RELATIVE_PERIODS } from '../../utils/periods/relativePeriods.js'
import { cacheStrategies } from '../standard-report/standard.report.conf.js'
import styles from './NewStandardReport.module.css'

const basePath = sections[STANDARD_REPORT_NEXT_SECTION_KEY].path

/*
 * Creating a standard report, as its own page rather than a dialog. The
 * fields are those the legacy add/edit form requires, less the report type:
 * Jasper is deprecated, so every report created here is an HTML report.
 *
 * Prototype: the form validates and then returns to the list. Nothing is
 * posted to the API yet.
 */
export const NewStandardReport = () => {
    const history = useHistory()

    const [values, setValues] = useState({
        name: '',
        designContent: null,
        designFileName: '',
        relativePeriods: {},
        reportParams: {},
        cacheStrategy: 'RESPECT_SYSTEM_SETTING',
    })
    const [errors, setErrors] = useState({})

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
        if (!values.designContent) {
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
                    leaf={i18n.t('New standard report')}
                />
            </header>

            <div className={styles.scroll}>
                <div className={styles.column}>
                    <h1 className={styles.title}>
                        {i18n.t('New standard report')}
                    </h1>
                    <p className={styles.lede}>
                        {i18n.t(
                            'Register a report design so it can be run against current data. Fields marked with * are required.'
                        )}
                    </p>

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
                                required
                                label={i18n.t('Design file')}
                                name="designContent"
                                buttonLabel={i18n.t('Select file')}
                                error={Boolean(errors.designContent)}
                                validationText={errors.designContent}
                                helpText={
                                    values.designFileName ||
                                    i18n.t(
                                        'The HTML design file that defines the report layout.'
                                    )
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
                            {i18n.t('Create report')}
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
