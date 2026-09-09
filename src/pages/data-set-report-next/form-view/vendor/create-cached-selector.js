/*
 * A stand-in for `re-reselect`'s createCachedSelector, which the vendored
 * metadata selectors are written against.
 *
 * `re-reselect` is not a dependency of this app, and plain reselect will not
 * do: its cache size is one, so alternating between two category combos —
 * which is exactly what a section form with several combos does on every
 * render — would recompute both every time.
 *
 * The contract reproduced here is the part the selectors use:
 *
 *   createCachedSelector(...inputSelectors, resultFn)(keySelector)
 *
 * The returned selector calls keySelector with its arguments to get a cache
 * key, then delegates to a reselect selector held per key. Each key therefore
 * gets its own cache of one, which is what re-reselect gives us.
 *
 * Not implemented: cache eviction, `getMatchingSelector`, `removeMatchingSelector`,
 * `cacheObject` options. None are used by the vendored code. The cache is
 * unbounded, which is fine for the handful of keys one data set produces.
 */
import { createSelector } from 'reselect'

export const createCachedSelector =
    (...args) =>
    (keySelector) => {
        const selectorsByKey = new Map()

        const cachedSelector = (...selectorArgs) => {
            const key = keySelector(...selectorArgs)

            let selector = selectorsByKey.get(key)

            if (!selector) {
                selector = createSelector(...args)
                selectorsByKey.set(key, selector)
            }

            return selector(...selectorArgs)
        }

        /* re-reselect exposes this; harmless to provide. */
        cachedSelector.cache = selectorsByKey

        return cachedSelector
    }

export default createCachedSelector
