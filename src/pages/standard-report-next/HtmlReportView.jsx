import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    CSS_FILES,
    PAGE_STYLES,
    SCRIPT_FILES,
} from '../standard-report/HtmlReportAssets.js'
import styles from './HtmlReportView.module.css'

/*
 * A standard report's HTML is a fragment written against the old DHIS2 web
 * front end: it expects jQuery, the legacy stylesheets and the global helpers
 * to be present. So it is given its own document with those assets in the
 * head, rather than being injected into this app's page where it would both
 * fail to find them and be free to restyle everything around it.
 *
 * This is the existing HtmlReport component with two changes: the context path
 * comes from app-runtime rather than the d2 instance, and the height observer
 * is a hook. The asset lists themselves are imported unchanged.
 */

const createScriptTag = (contextPath, script) =>
    `<script src="${contextPath}${script}" type="text/javascript"></script>`

const createLinkTag = (contextPath, { media, styleSheet }) =>
    `<link type="text/css" rel="stylesheet" media="${media}" href="${contextPath}${styleSheet}">`

const wrapHtmlInTemplate = (contextPath, html) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${CSS_FILES.map((file) => createLinkTag(contextPath, file)).join(
                '\n'
            )}
            ${SCRIPT_FILES.map((file) =>
                createScriptTag(contextPath, file)
            ).join('\n')}
            <style type="text/css">
                ${PAGE_STYLES}
            </style>
        </head>
        <body>
            ${html}
        </body>
    </html>
`

export const HtmlReportView = ({ html }) => {
    const { baseUrl } = useConfig()
    const [height, setHeight] = useState(600)
    const observer = useRef(null)

    /*
     * The iframe cannot size itself to its content, and a fixed height either
     * clips a long report or leaves a tall gap under a short one. So the
     * content is measured and the frame follows it — and keeps following,
     * because report designs routinely draw themselves with script after load.
     */
    const onLoad = useCallback((event) => {
        const doc = event.target.contentWindow.document
        const measure = () =>
            setHeight(
                Math.ceil(
                    Math.max(
                        doc.documentElement.getBoundingClientRect().height,
                        doc.body.getBoundingClientRect().height
                    )
                ) + 20 // safety margin
            )

        observer.current?.disconnect()
        observer.current = new window.ResizeObserver(measure)
        observer.current.observe(doc.documentElement)
        observer.current.observe(doc.body)

        measure()
    }, [])

    useEffect(() => () => observer.current?.disconnect(), [])

    return (
        <iframe
            title="html-report-content"
            srcDoc={wrapHtmlInTemplate(baseUrl, html)}
            width="100%"
            height={height}
            className={styles.iframe}
            sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
            onLoad={onLoad}
        />
    )
}

HtmlReportView.propTypes = {
    html: PropTypes.string.isRequired,
}
