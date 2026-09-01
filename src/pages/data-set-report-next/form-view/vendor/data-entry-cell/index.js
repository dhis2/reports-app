/*
 * Shim, not vendored code.
 *
 * The vendored layout components import their leaf cell from
 * `../data-entry-cell/index.js`. Keeping that path resolvable here means the
 * three call sites that use it — category-combo-table-body.jsx, its pivoted
 * variant and data-element-cell.jsx — need no edits at all.
 *
 * See ../../ReadOnlyValueCell.jsx for what replaces the editing field.
 */
export {
    DataEntryCell,
    DataEntryField,
    useActiveCell,
} from '../../ReadOnlyValueCell.jsx'
