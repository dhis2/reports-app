import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    NoticeBox,
    OrganisationUnitTree,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import {
    dropUnopenedPeriods,
    generatePeriods,
    needsYear,
    yearOptions,
} from '../data-set-report-next/periods.js'
import { periodOptionsForReport } from './reportShape.js'
import styles from './StandardReportNext.module.css'

/*
 * SingleSelectField throws if `selected` is not among its options, and a value
 * restored from the URL is present on the very first render, before the
 * options that would match it have been worked out. So never hand it a value
 * it cannot match.
 */
const safeSelected = (options, value) =>
    value && options.some((option) => option.id === value) ? value : ''

/**
 * The configure half of the rail: whatever this particular report asks for.
 *
 * Both fields are conditional, and most reports show neither.
 */
export const ReportParamsFields = ({
    report,
    needs,
    selection,
    update,
    roots,
    rootsLoading,
    rootsError,
    onOrgUnitName,
}) => {
    const periodOptions = useMemo(
        () => (needs.period ? periodOptionsForReport(report) : []),
        [report, needs.period]
    )

    const chosenOption = periodOptions.find(
        (option) => option.id === selection.periodType
    )

    /*
     * A true relative period ("Last month") is the whole answer. A fixed
     * period type ("Monthly") only narrows what the second control offers.
     */
    const wantsConcretePeriod = Boolean(
        chosenOption && !chosenOption.isRelative
    )

    const periods = useMemo(() => {
        if (!wantsConcretePeriod) {
            return []
        }

        return dropUnopenedPeriods(
            generatePeriods(selection.periodType, selection.year)
        )
    }, [wantsConcretePeriod, selection.periodType, selection.year])

    return (
        <>
            {needs.orgUnit && (
                <section className={styles.group}>
                    <h3 className={styles.groupTitle}>
                        {i18n.t('Organisation unit')}
                    </h3>
                    <div className={styles.treeBox}>
                        {rootsLoading && <CircularLoader small />}
                        {rootsError && (
                            <NoticeBox error>
                                {i18n.t('Could not load organisation units.')}
                            </NoticeBox>
                        )}
                        {!rootsLoading && roots.length > 0 && (
                            <OrganisationUnitTree
                                roots={roots}
                                singleSelection
                                selected={
                                    selection.ouPath ? [selection.ouPath] : []
                                }
                                initiallyExpanded={roots.map((id) => `/${id}`)}
                                onChange={({ path, displayName }) => {
                                    onOrgUnitName(displayName)
                                    update({ ouPath: path })
                                }}
                            />
                        )}
                    </div>
                </section>
            )}

            {needs.period && (
                <section className={styles.group}>
                    <h3 className={styles.groupTitle}>{i18n.t('Period')}</h3>
                    <SingleSelectField
                        dense
                        filterable={periodOptions.length > 8}
                        /* "Period" is the group title above. */
                        label={i18n.t('Type')}
                        selected={safeSelected(
                            periodOptions,
                            selection.periodType
                        )}
                        onChange={({ selected }) => {
                            const option = periodOptions.find(
                                (candidate) => candidate.id === selected
                            )

                            /*
                             * A relative period is its own answer, so it sets
                             * the value that gets sent. A period type only
                             * opens the second control, so it clears any
                             * period left over from the previous type.
                             */
                            update({
                                periodType: selected,
                                pe: option?.isRelative ? selected : '',
                            })
                        }}
                        noMatchText={i18n.t('No period matches')}
                    >
                        {periodOptions.map((option) => (
                            <SingleSelectOption
                                dense
                                key={option.id}
                                value={option.id}
                                label={option.displayName}
                            />
                        ))}
                    </SingleSelectField>

                    {wantsConcretePeriod && (
                        <div className={styles.subFields}>
                            {needsYear(selection.periodType) && (
                                <SingleSelectField
                                    dense
                                    filterable
                                    label={i18n.t('Year')}
                                    selected={String(selection.year)}
                                    onChange={({ selected }) =>
                                        update({
                                            year: Number(selected),
                                            pe: '',
                                        })
                                    }
                                    noMatchText={i18n.t('No year matches')}
                                >
                                    {yearOptions().map((year) => (
                                        <SingleSelectOption
                                            dense
                                            key={year}
                                            value={String(year)}
                                            label={String(year)}
                                        />
                                    ))}
                                </SingleSelectField>
                            )}

                            <SingleSelectField
                                dense
                                filterable={periods.length > 12}
                                label={i18n.t('Reporting period')}
                                selected={safeSelected(periods, selection.pe)}
                                onChange={({ selected }) =>
                                    update({ pe: selected })
                                }
                                noMatchText={i18n.t('No period matches')}
                            >
                                {periods.map((period) => (
                                    <SingleSelectOption
                                        dense
                                        key={period.id}
                                        value={period.id}
                                        label={period.name}
                                    />
                                ))}
                            </SingleSelectField>

                            {periods.length === 0 && (
                                <p className={styles.help}>
                                    {i18n.t(
                                        'No finished period of this type is available for {{year}}.',
                                        { year: selection.year }
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}
        </>
    )
}

ReportParamsFields.propTypes = {
    needs: PropTypes.shape({
        orgUnit: PropTypes.bool,
        period: PropTypes.bool,
    }).isRequired,
    report: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    roots: PropTypes.array,
    rootsError: PropTypes.object,
    rootsLoading: PropTypes.bool,
    onOrgUnitName: PropTypes.func,
}

ReportParamsFields.defaultProps = {
    roots: [],
}
