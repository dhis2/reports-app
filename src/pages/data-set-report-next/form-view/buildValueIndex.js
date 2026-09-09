/*
 * Bridge between the report response and the data entry form layout.
 *
 * Form view renders the Aggregate Data Entry layout components, which look
 * values up by data element id and category option combo id. The report
 * response has neither.
 *
 * The obvious plan was to read the ids off the response. `GET /api/dataSetReport`
 * builds each cell as a `GridValue` carrying `de` and `co` uid attributes
 * (DefaultDataSetReportService.java:250-251), but those attributes do not
 * survive JSON serialisation — a row comes back as a flat array of scalars:
 *
 *   headers: [{ name: 'Data element', meta: true }, { name: 'Fixed, <1y' }, ...]
 *   rows:    [['BCG doses given', '6109', '23', ...], ...]
 *
 * `metaData` is `{}`, so there is no id anywhere in the payload.
 *
 * What the payload does give us is names, and they are the names the form
 * already knows. The grid is built per (section x categoryCombo) with:
 *   - row label   = dataElement.getFormNameFallback()  -> displayFormName
 *   - value cols  = categoryCombo.getSortedOptionCombos(), by name
 *                   ("Value" for the default combo)
 * so a name index resolves every cell the form asks for.
 *
 * Matching on names rather than fetching values separately is deliberate:
 * both views then read from one response, so Standard and Form can never
 * disagree about a number, and sub-unit aggregation and dimension filters are
 * honoured for free because the server already applied them.
 *
 * Known limits, acceptable for a prototype:
 *   - Two data elements sharing a display form name collapse into one entry.
 *   - A category option combo named "Total", or named after a category option
 *     in a multi-category combo, can collide with the server's subtotal and
 *     total columns. Real combos are named from their options, so this needs a
 *     deliberately odd configuration to hit.
 */

/* The header the server uses for the default category option combo. */
const DEFAULT_COMBO_HEADER = 'Value'

/*
 * Columns the server appends after the real value columns: per-category
 * subtotals and a grand total. They are not category option combos, so the
 * form never asks for them, but they are skipped explicitly so that a combo
 * whose name happens to match cannot pick up a subtotal figure.
 */
const TOTAL_HEADER = 'Total'

/**
 * Flattens the report grids into { [dataElementFormName]: { [comboName]: value } }.
 *
 * @param {Array} grids the array `GET /api/dataSetReport` returns
 * @returns {Object} name-keyed value index
 */
export const buildValueIndex = (grids = []) => {
    const index = {}

    grids.forEach((grid) => {
        const headers = grid?.headers || []
        const labelColumns = headers
            .map((header, position) => ({ header, position }))
            .filter(({ header }) => header?.meta)
        const labelPosition = labelColumns.length ? labelColumns[0].position : 0

        ;(grid?.rows || []).forEach((cells) => {
            const rowLabel = cells?.[labelPosition]

            if (typeof rowLabel !== 'string' || !rowLabel) {
                return
            }

            const row = index[rowLabel] || (index[rowLabel] = {})

            headers.forEach((header, position) => {
                if (
                    position === labelPosition ||
                    header?.meta ||
                    header?.hidden ||
                    !header?.name ||
                    header.name === TOTAL_HEADER
                ) {
                    return
                }

                const cell = cells?.[position]

                if (cell === null || cell === undefined || cell === '') {
                    return
                }

                /*
                 * First write wins. Subtotal columns come after the real value
                 * columns, so if a name did collide the true value is already
                 * in place.
                 */
                if (row[header.name] === undefined) {
                    row[header.name] = cell
                }
            })
        })
    })

    return index
}

/**
 * Looks one form cell up in the index.
 *
 * @param {Object} index from buildValueIndex
 * @param {Object} dataElement needs displayFormName
 * @param {Object} categoryOptionCombo needs displayName and isDefault
 */
export const lookupValue = (index, dataElement, categoryOptionCombo) => {
    const row = index?.[dataElement?.displayFormName]

    if (!row) {
        return undefined
    }

    return row[comboHeaderName(row, categoryOptionCombo)]
}

/**
 * The header name a category option combo appears under in the report.
 *
 * Normally that is just the combo's name, but the server writes "Value" for
 * the default combo rather than its name, which is the string "default" in
 * metadata. Exported because resolveValues needs to record which header each
 * matched value came from.
 *
 * @param {Object} row the index row for one data element, used to prefer
 *   whichever spelling of the default combo the response actually used
 * @param {Object} categoryOptionCombo needs displayName and isDefault
 */
export const comboHeaderName = (row, categoryOptionCombo) => {
    const comboName = categoryOptionCombo?.displayName

    if (categoryOptionCombo?.isDefault || comboName === 'default') {
        return row?.[DEFAULT_COMBO_HEADER] !== undefined
            ? DEFAULT_COMBO_HEADER
            : comboName
    }

    return comboName
}
