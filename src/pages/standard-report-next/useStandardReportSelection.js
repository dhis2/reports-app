import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/*
 * The parameters for one report.
 *
 * Which report you are looking at is the route — /standard-report-next/:id —
 * so this only carries what that report is being run *with*. Those live in
 * the query string, so a run is linkable, survives a refresh and works with
 * the back button.
 *
 * The app uses hash history, so the search string sits inside the hash:
 *   #/standard-report-next/Kvk9TrPBhlH?pt=Monthly&pe=202508&ou=/ImspTQPwCqd
 *
 * `periodType` is the option chosen in the first period dropdown. For a true
 * relative period it is the answer on its own and `pe` matches it; for a fixed
 * period type it only narrows the second dropdown, which sets `pe`.
 */
const STORAGE_KEY = 'reports-app:standard-report-next:last'

export const emptySelection = {
    ouPath: '',
    periodType: '',
    year: new Date().getFullYear(),
    pe: '',
}

const fromSearch = (search) => {
    const params = new URLSearchParams(search)

    /* Nothing of ours in the URL — this is a fresh visit, not a link. */
    if (!params.get('ou') && !params.get('pe')) {
        return null
    }

    return {
        ouPath: params.get('ou') || '',
        periodType: params.get('pt') || '',
        year: Number(params.get('y')) || emptySelection.year,
        pe: params.get('pe') || '',
    }
}

const toSearch = (selection) => {
    const params = new URLSearchParams()

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
     * someone sent you always opens the run they meant.
     */
    const remembered = useMemo(readRemembered, [])
    const restoredFromMemory = useRef(false)
    const restoredFromUrl = useRef(false)
    const [selection, setSelection] = useState(() => {
        const fromUrl = fromSearch(location.search)

        if (fromUrl) {
            restoredFromUrl.current = true
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

    const remember = useCallback((value) => {
        writeRemembered({ ouPath: value.ouPath })
    }, [])

    return {
        selection,
        update,
        remember,
        restoredFromMemory: restoredFromMemory.current,
        /*
         * Whether the run was described by the link that opened the page. It
         * is the difference between showing the report at once and waiting to
         * be asked — a link that names a period means the report, not a form
         * pre-filled with someone else's answer.
         */
        restoredFromUrl: restoredFromUrl.current,
    }
}
