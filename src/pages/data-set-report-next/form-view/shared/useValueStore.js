/*
 * Stand-in for the data entry app's zustand value store.
 *
 * Upstream this store is read and written continuously as someone types, and
 * the selector-with-subscription shape zustand gives you is what keeps a large
 * form from re-rendering on every keystroke. A report is rendered once from a
 * fixed response, so there is nothing to subscribe to — the store can be a
 * plain immutable object on a context.
 *
 * The `useValueStore(selector)` call signature is kept because the vendored
 * code uses it:
 *
 *   useValueStore((state) => state.getDataValues())
 *
 * so the context value exposes the same accessors the real store does, and the
 * hook applies the selector to them. Only the accessors the vendored layout
 * components reach for are implemented; the editing accessors (min/max,
 * comments, completion, initial values) are not, since nothing read-only calls
 * them.
 *
 * Values are keyed the way the real store keys them:
 *   { [dataElementId]: { [categoryOptionComboId]: { value } } }
 */
import { createContext, useContext } from 'react'

const EMPTY_VALUES = {}

const createState = (dataValues) => ({
    getDataValues: () => dataValues,
    getDataValue: ({ dataElementId, categoryOptionComboId }) =>
        dataValues?.[dataElementId]?.[categoryOptionComboId],
    hasComment: () => false,
    getMinMaxValues: () => undefined,
    isComplete: () => false,
})

export const ReportValueContext = createContext(createState(EMPTY_VALUES))

export const createValueState = createState

export const useValueStore = (selector) => {
    const state = useContext(ReportValueContext)

    return typeof selector === 'function' ? selector(state) : state
}

/*
 * Upstream this returns the field that most recently lost focus, and the totals
 * code uses it to decide when to rebuild its value matrix. With no editing
 * there is never a blurred field, so the matrix is built once and kept — which
 * is the behaviour we want.
 */
export const useBlurredField = () => undefined
