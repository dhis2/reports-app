import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/*
 * The selection lives in the URL, so a report is linkable, survives a refresh
 * and works with the back button. The last selection is also remembered
 * locally, because people run the same report every month.
 *
 * The app uses hash history, so the search string sits inside the hash:
 *   #/standard-report-next?id=Kvk9TrPBhlH&pt=Monthly&pe=202508&ou=/ImspTQPwCqd
 *
 * `periodType` is the option chosen in the first period dropdown. For a true
 * relative period it is the answer on its own and `pe` matches it; for a fixed
 * period type it only narrows the second dropdown, which sets `pe`.
 */
const STORAGE_KEY = 'reports-app:standard-report-next:last'

export const emptySelection = {
    reportId: '',
    ouPath: '',
    periodType: '',
    year: new Date().getFullYear(),
    pe: '',
}

const fromSearch = (search) => {
    const params = new URLSearchParams(search)

    if (!params.get('id')) {
        return null
    }

    return {
        reportId: params.get('id') || '',
        ouPath: params.get('ou') || '',
        periodType: params.get('pt') || '',
        year: Number(params.get('y')) || emptySelection.year,
        pe: params.get('pe') || '',
    }
}

const toSearch = (selection) => {
    const params = new URLSearchParams()

    if (selection.reportId) {
        params.set('id', selection.reportId)
    }
    if (selection.ouPath) {
        params.set('ou', selection.ouPath)
    }
    if (selection.periodType) {
        params.set('pt', selection.periodType)
    }
    if (selection.year) {
        params.set('y', String(selection.year))
    }
    if (selection.pe) {
        params.set('pe', selection.pe)
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

export const useStandardReportSelection = () => {
    const history = useHistory()
    const location = useLocation()

    /*
     * Read once on mount. The URL wins over what we remembered, so a link
     * someone sent you always opens the report they meant.
     *
     * Only the org unit is restored from memory, never the report: selecting
     * a report is what generates it, and a page that runs last month's report
     * against the server the moment you open it is not what anyone asked for.
     */
    const remembered = useMemo(readRemembered, [])
    const restoredFromMemory = useRef(false)
    const [selection, setSelection] = useState(() => {
        const fromUrl = fromSearch(location.search)

        if (fromUrl) {
            return fromUrl
        }

        if (remembered?.ouPath) {
            restoredFromMemory.current = true
            return { ...emptySelection, ouPath: remembered.ouPath }
        }

        return emptySelection
    })

    /* Keep the URL in step, without adding a history entry per keystroke. */
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

    /*
     * Changing report clears the parameters with it. The old period belonged
     * to the old report's list of allowed periods and is very unlikely to be
     * in the new one — carrying it over would silently hand the next report a
     * value it never offered.
     */
    const selectReport = useCallback((reportId) => {
        setSelection((current) => ({
            ...current,
            reportId,
            periodType: '',
            pe: '',
        }))
    }, [])

    const clearReport = useCallback(() => {
        setSelection((current) => ({
            ...current,
            reportId: '',
            periodType: '',
            pe: '',
        }))
    }, [])

    const remember = useCallback((value) => {
        writeRemembered({ ouPath: value.ouPath })
    }, [])

    return {
        selection,
        update,
        selectReport,
        clearReport,
        remember,
        restoredFromMemory: restoredFromMemory.current,
    }
}
