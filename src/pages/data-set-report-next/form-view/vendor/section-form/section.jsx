import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconChevronDown16,
    IconChevronUp16,
    IconFilter16,
    Table,
    TableCellHead,
    TableHead,
    TableRowHead,
} from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useMetadata, selectors } from '../../shared/index.js'
import { CategoryComboTableBody } from '../category-combo-table-body/index.js'
import { PivotedCategoryComboTableBody } from '../category-combo-table-body-pivoted/index.js'
import { getFieldId } from '../get-field-id.jsx'
import { IndicatorsTableBody } from '../indicators-table-body/indicators-table-body.jsx'
import { getDisplayOptions } from './displayOptions.js'
import { SanitizedText } from './sanitized-text.jsx'
import styles from './section.module.css'

export function SectionFormSection({
    section,
    dataSetId,
    globalFilterText,
    collapsible,
}) {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const [showSectionContent, setShowSectionContent] = useState(true)

    const { data } = useMetadata()

    const dataElements = selectors.getDataElementsBySection(
        data,
        dataSetId,
        section.id
    )
    const indicators = selectors.getIndicatorsByDataSetIdAndSectionId(
        data,
        dataSetId,
        section.id
    )

    const groupedDataElements = section.disableDataElementAutoGroup
        ? selectors.getGroupedDataElementsByCatComboInOrder(data, dataElements)
        : selectors.getGroupedDataElementsByCatCombo(data, dataElements)

    const maxColumnsInSection = useMemo(() => {
        if (groupedDataElements.length === 0) {
            return 0
        }
        const groupedTotalColumns = groupedDataElements.map((grp) =>
            selectors.getNrOfColumnsInCategoryCombo(data, grp.categoryCombo.id)
        )
        return Math.max(...groupedTotalColumns)
    }, [data, groupedDataElements])

    const greyedFields = useMemo(
        () =>
            new Set(
                section.greyedFields.map((greyedField) =>
                    getFieldId(
                        greyedField.dataElement.id,
                        greyedField.categoryOptionCombo.id
                    )
                )
            ),
        [section.greyedFields]
    )

    const filterInputId = `filter-input-${section.id}`
    const headerCellStyles = classNames(styles.headerCell, styles.hideForPrint)

    const displayOptions = getDisplayOptions(section)

    const isPivotMode =
        displayOptions?.pivotMode === 'move_categories' ||
        displayOptions?.pivotMode === 'pivot'

    const TableComponent = isPivotMode
        ? PivotedCategoryComboTableBody
        : CategoryComboTableBody

    const { beforeSectionText, afterSectionText } = displayOptions

    const onSectionHeadClicked = () => {
        collapsible &&
            setShowSectionContent((displayingContent) => !displayingContent)
    }

    const onSectionHeadEntered = (e) => {
        e.key === 'Enter' && onSectionHeadClicked()
    }

    return (
        <div>
            <SanitizedText className={styles.sectionDescription}>
                {beforeSectionText}
            </SanitizedText>
            <Table className={styles.table} suppressZebraStriping>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead
                            colSpan="100%"
                            className={styles.headerCell}
                        >
                            <div className={styles.labelWrapper}>
                                <div
                                    className={styles.collapseIcon}
                                    tabIndex={collapsible ? 0 : -1}
                                    onClick={onSectionHeadClicked}
                                    onKeyDown={onSectionHeadEntered}
                                >
                                    {collapsible &&
                                        (showSectionContent ? (
                                            <IconChevronUp16 color="var(--colors-white)" />
                                        ) : (
                                            <IconChevronDown16 color="var(--colors-white)" />
                                        ))}
                                </div>
                                <div>
                                    <div className={styles.title}>
                                        {section.displayName}
                                    </div>
                                    {section.description && (
                                        <div className={styles.description}>
                                            {section.description ||
                                                'Placeholder section description'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TableCellHead>
                    </TableRowHead>
                    {showSectionContent && (
                        <TableRowHead>
                            <TableCellHead
                                colSpan="100%"
                                className={headerCellStyles}
                            >
                                <label
                                    htmlFor={filterInputId}
                                    className={styles.filterWrapper}
                                >
                                    <IconFilter16 color={colors.grey600} />
                                    <input
                                        name={filterInputId}
                                        id={filterInputId}
                                        type="text"
                                        placeholder={i18n.t(
                                            'Type here to filter rows in this section'
                                        )}
                                        value={filterText}
                                        onChange={({ target }) =>
                                            setFilterText(target.value)
                                        }
                                        className={styles.filterInput}
                                    />
                                </label>
                            </TableCellHead>
                        </TableRowHead>
                    )}
                </TableHead>
                {groupedDataElements.map(
                    ({ categoryCombo, dataElements }, i) => (
                        <TableComponent
                            key={i} //if disableDataElementAutoGroup then duplicate catCombo-ids, so have to use index
                            categoryCombo={categoryCombo}
                            dataElements={dataElements}
                            filterText={filterText}
                            globalFilterText={globalFilterText}
                            maxColumnsInSection={maxColumnsInSection}
                            renderRowTotals={section.showRowTotals}
                            renderColumnTotals={section.showColumnTotals}
                            greyedFields={greyedFields}
                            displayOptions={displayOptions}
                            collapsed={!showSectionContent}
                        />
                    )
                )}
                {indicators.length > 0 && showSectionContent && (
                    <IndicatorsTableBody
                        indicators={indicators}
                        renderRowTotals={section.showRowTotals}
                        maxColumnsInSection={maxColumnsInSection}
                        filterText={filterText}
                        globalFilterText={globalFilterText}
                    />
                )}
            </Table>
            <SanitizedText className={styles.sectionDescription}>
                {afterSectionText}
            </SanitizedText>
        </div>
    )
}

SectionFormSection.propTypes = {
    collapsible: PropTypes.bool,
    dataSetId: PropTypes.string,
    globalFilterText: PropTypes.string,
    section: PropTypes.shape({
        dataSet: PropTypes.shape({
            id: PropTypes.string,
        }),
        description: PropTypes.string,
        disableDataElementAutoGroup: PropTypes.bool,
        displayName: PropTypes.string,
        displayOptions: PropTypes.string,
        greyedFields: PropTypes.array,
        id: PropTypes.string,
        showColumnTotals: PropTypes.bool,
        showRowTotals: PropTypes.bool,
    }),
}

SectionFormSection.defaultProps = {
    collapsible: false,
}
