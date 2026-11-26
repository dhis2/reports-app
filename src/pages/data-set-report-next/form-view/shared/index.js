/*
 * Stand-in for the Aggregate Data Entry app's src/shared/index.js.
 *
 * Every vendored layout component imports its ambient dependencies from
 * `shared/index.js` at some relative depth, and all of those paths resolve
 * here. Satisfying them at this one path is what lets the vendored files stay
 * byte-for-byte identical to upstream.
 *
 * Upstream, `shared` is the data entry app's whole state layer: react-query
 * for metadata, zustand stores for values, highlighting, sync errors and
 * validation, plus URL-backed context selection. A report needs none of that.
 * What it needs is the four things the layout components actually read:
 *
 *   useMetadata        the form structure
 *   selectors          pure functions over that structure
 *   useValueStore      the numbers to put in the cells
 *   useBlurredField    a cache-invalidation signal for totals
 *
 * The first two are real. The last two are reduced to what a read-only render
 * needs, which is why neither react-query nor zustand is a dependency here.
 */
export { useMetadata } from './FormMetadataContext.js'
export { useValueStore, useBlurredField } from './useValueStore.js'
export { useSectionFilter } from './useSectionFilter.js'
export { NUMBER_TYPES, VALUE_TYPES } from '../vendor/value-types.js'
export * as selectors from '../vendor/selectors.js'
