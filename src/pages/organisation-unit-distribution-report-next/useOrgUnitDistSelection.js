import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/*
 * The form selection lives in the URL, so a report is linkable, survives a
 * refresh and works with the back button. The last selection is also kept in
 * local storage, because most people ask the same question of the same part
 * of the hierarchy each time.
 *
 * The app uses hash history, so the search string sits inside the hash:
 *   #/organisation-unit-distribution-report-next?ou=/ImspTQPwCqd&ougs=Bpx0589u8y0
 */
const STORAGE_KEY = 'reports-app:org-unit-dist-report-next:last'

export const emptySelection = {
    ouPath: '',
    groupSetId: '',
}

const fromSearch = (search) => {
    const params = new URLSearchParams(search)

    if (!params.get('ou') && !params.get('ougs')) {
        return null
    }

    return {
        ouPath: params.get('ou') || '',
        groupSetId: params.get('ougs') || '',
    }
}

const toSearch = (selection) => {
    const params = new URLSearchParams()

    if (selection.ouPath) {
        params.set('ou', selection.ouPath)
    }
    if (selection.groupSetId) {
        params.set('ougs', selection.groupSetId)
    }

    const search = params.toString()
    return search ? `?${search}` : ''
}

const readRemembered = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        // Private browsing, blocked storage, or a value we can no longer read.
        return null
    }
}

const writeRemembered = (value) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
        // Remembering is a convenience — never break the page over it.
    }
}

export const useOrgUnitDistSelection = () => {
    const history = useHistory()
    const location = useLocation()

    /*
     * Read once on mount. The URL wins over what we remembered, so a link
     * someone sent you always opens the report they meant.
     */
    const remembered = useMemo(readRemembered, [])
    const restoredFromMemory = useRef(false)
    const [selection, setSelection] = useState(() => {
        const fromUrl = fromSearch(location.search)

        if (fromUrl) {
            return fromUrl
        }

        if (remembered) {
            restoredFromMemory.current = true
            return {
                ouPath: remembered.ouPath || '',
                groupSetId: remembered.groupSetId || '',
            }
        }

        return emptySelection
    })

    /* Keep the URL in step, without adding a history entry per change. */
    const lastSearch = useRef(location.search)
    useEffect(() => {
        const search = toSearch(selection)

        if (search !== lastSearch.current) {
            lastSearch.current = search
            history.replace({ pathname: location.pathname, search })
        }
    }, [selection, history, location.pathname])

    const update = useCallback((changes) => {
        setSelection((current) => ({ ...current, ...changes }))
    }, [])

    const reset = useCallback(() => {
        setSelection(emptySelection)
    }, [])

    const remember = useCallback((value) => {
        writeRemembered({
            ouPath: value.ouPath,
            groupSetId: value.groupSetId,
        })
    }, [])

    return {
        selection,
        update,
        reset,
        remember,
        restoredFromMemory: restoredFromMemory.current,
    }
}

/* Exported for the tests, which check the URL round trip. */
export const serialise = toSearch
export const deserialise = fromSearch
