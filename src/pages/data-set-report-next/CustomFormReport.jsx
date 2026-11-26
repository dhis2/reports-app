import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import {
    CSS_FILES,
    PAGE_STYLES,
    SCRIPT_FILES,
} from '../standard-report/HtmlReportAssets.js'
import styles from './DataSetReportNext.module.css'

/*
 * Custom-form data sets come back as a finished HTML page built by the server.
 * We can frame it, label it and put a summary above it — we cannot restyle
 * what is inside it. It goes in a sandboxed frame that grows to fit.
 *
 * The asset lists are reused from the existing report viewer; they are plain
 * constants, so importing them pulls in no legacy plumbing. Only the context
 * path differs: this takes baseUrl instead of reading it off the d2 instance.
 */
const buildDocument = (html, baseUrl) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${CSS_FILES.map(
                ({ media, styleSheet }) =>
                    `<link type="text/css" rel="stylesheet" media="${media}" href="${baseUrl}${styleSheet}">`
            ).join('\n')}
            ${SCRIPT_FILES.map(
                (script) =>
                    `<script src="${baseUrl}${script}" type="text/javascript"></script>`
            ).join('\n')}
            <style type="text/css">${PAGE_STYLES}</style>
        </head>
        <body>${html}</body>
    </html>
`

export const CustomFormReport = ({ html, baseUrl }) => {
    const [height, setHeight] = useState(400)
    const observerRef = useRef(null)

    useEffect(
        () => () => {
            observerRef.current?.disconnect()
        },
        []
    )

    const onLoad = (event) => {
        const frame = event.target.contentWindow?.document
        if (!frame) {
            return
        }

        const measure = () => {
            const next = Math.max(
                frame.documentElement.getBoundingClientRect().height,
                frame.body.getBoundingClientRect().height
            )
            setHeight(Math.ceil(next) + 20)
        }

        observerRef.current?.disconnect()
        observerRef.current = new window.ResizeObserver(measure)
        observerRef.current.observe(frame.documentElement)
        observerRef.current.observe(frame.body)
        measure()
    }

    return (
        <iframe
            title="Custom form report"
            className={styles.customFrame}
            srcDoc={buildDocument(html, baseUrl)}
            width="100%"
            height={height}
            sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
            onLoad={onLoad}
        />
    )
}

CustomFormReport.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
}
