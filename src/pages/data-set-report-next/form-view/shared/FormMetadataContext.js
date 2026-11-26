/*
 * Holds the resolved form metadata for the vendored components.
 *
 * Upstream, `useMetadata()` is a react-query hook that any component can call
 * and get a shared, cached result. The vendored components rely on that: half
 * a dozen of them call it independently, with no arguments, and expect one
 * shared object back.
 *
 * A context reproduces exactly that contract without react-query. FormView
 * fetches once and puts the result here; every vendored caller reads it.
 */
import { createContext, useContext } from 'react'

export const FormMetadataContext = createContext({ data: undefined })

/** The no-argument hook the vendored components call. */
export const useMetadata = () => useContext(FormMetadataContext)
