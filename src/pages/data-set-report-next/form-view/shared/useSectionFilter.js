/*
 * Stand-in for the data entry app's URL-backed section filter.
 *
 * Upstream this is a query parameter that narrows the form to a single
 * section. A report shows the whole form, so this always reports "no filter"
 * and every section renders. Kept as a hook returning a tuple so the vendored
 * call site — `const [sectionId] = useSectionFilter()` — is unchanged.
 */
export const useSectionFilter = () => [undefined, () => {}]
