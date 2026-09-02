import PropTypes from 'prop-types'
import React from 'react'
import {
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import styles from './SectionArt.module.css'

/*
 * A drawing of the thing each section produces, shown on its card.
 *
 * These are pictures, not previews of live data — they are deliberately
 * abstract enough that they never claim to be a real report, but concrete
 * enough that a table reads as a table and a chart as a chart.
 */

const INK = '#212934'
const LINE = '#d5dde5'
const FAINT = '#e8edf2'
const MUTED = '#a0adba'
const BLUE = '#147cd7'
const BLUE_SOFT = '#a4d4fd'
const TEAL = '#0d9488'
const AMBER = '#f2ae2e'

/** The white sheet every drawing sits on. */
const Sheet = ({ children }) => (
    <svg
        className={styles.art}
        viewBox="0 0 260 150"
        aria-hidden="true"
        focusable="false"
    >
        <rect
            x="18"
            y="12"
            width="224"
            height="130"
            rx="8"
            fill="#ffffff"
            stroke={FAINT}
        />
        {children}
    </svg>
)

Sheet.propTypes = { children: PropTypes.node }

const bar = (x, height, fill) => (
    <rect
        key={`${x}-${fill}`}
        x={x}
        y={112 - height}
        width="12"
        height={height}
        rx="2"
        fill={fill}
    />
)

/* A report your team designed: a titled page with a chart in it. */
const StandardReportArt = () => (
    <Sheet>
        <rect x="34" y="30" width="70" height="6" rx="3" fill={INK} />
        <rect x="34" y="44" width="104" height="4" rx="2" fill={LINE} />
        <line x1="34" y1="112" x2="226" y2="112" stroke={LINE} />
        {bar(40, 34, BLUE_SOFT)}
        {bar(64, 52, BLUE)}
        {bar(88, 26, BLUE_SOFT)}
        {bar(112, 62, BLUE)}
        {bar(136, 44, BLUE_SOFT)}
        {bar(160, 70, BLUE)}
        {bar(184, 38, BLUE_SOFT)}
        {bar(208, 56, BLUE)}
    </Sheet>
)

/* A form, filled in: a table with values in the cells. */
const DataSetReportArt = () => (
    <Sheet>
        <rect x="34" y="28" width="192" height="18" rx="3" fill="#f4f6f8" />
        <rect x="42" y="35" width="44" height="4" rx="2" fill={MUTED} />
        <rect x="150" y="35" width="20" height="4" rx="2" fill={MUTED} />
        <rect x="192" y="35" width="20" height="4" rx="2" fill={MUTED} />
        {[0, 1, 2, 3].map((row) => {
            const y = 46 + row * 22
            return (
                <g key={row}>
                    <line x1="34" y1={y} x2="226" y2={y} stroke={FAINT} />
                    <rect
                        x="42"
                        y={y + 9}
                        width={64 - row * 8}
                        height="4"
                        rx="2"
                        fill={LINE}
                    />
                    <rect
                        x="150"
                        y={y + 9}
                        width="18"
                        height="4"
                        rx="2"
                        fill={row === 1 ? TEAL : INK}
                    />
                    <rect
                        x="192"
                        y={y + 9}
                        width="18"
                        height="4"
                        rx="2"
                        fill={INK}
                    />
                </g>
            )
        })}
    </Sheet>
)

/* How your facilities break down: a donut with a legend. */
const OrgUnitDistributionArt = () => (
    <Sheet>
        <g
            fill="none"
            strokeWidth="16"
            strokeLinecap="butt"
            transform="rotate(-90 84 77)"
        >
            {/* One circle per slice, drawn with dash offsets. */}
            <circle
                cx="84"
                cy="77"
                r="34"
                stroke={BLUE}
                strokeDasharray="94 120"
            />
            <circle
                cx="84"
                cy="77"
                r="34"
                stroke={TEAL}
                strokeDasharray="60 154"
                strokeDashoffset="-94"
            />
            <circle
                cx="84"
                cy="77"
                r="34"
                stroke={AMBER}
                strokeDasharray="60 154"
                strokeDashoffset="-154"
            />
        </g>
        {[BLUE, TEAL, AMBER].map((colour, row) => (
            <g key={colour}>
                <rect
                    x="146"
                    y={56 + row * 22}
                    width="8"
                    height="8"
                    rx="2"
                    fill={colour}
                />
                <rect
                    x="162"
                    y={58 + row * 22}
                    width={52 - row * 12}
                    height="4"
                    rx="2"
                    fill={LINE}
                />
            </g>
        ))}
    </Sheet>
)

/* Files and links: a small stack of them. */
const ResourceArt = () => (
    <Sheet>
        {[0, 1, 2].map((row) => {
            const y = 34 + row * 30
            return (
                <g key={row}>
                    <rect
                        x="34"
                        y={y}
                        width="192"
                        height="24"
                        rx="4"
                        fill="#f4f6f8"
                    />
                    <rect
                        x="44"
                        y={y + 6}
                        width="12"
                        height="12"
                        rx="2"
                        fill={row === 1 ? BLUE : MUTED}
                    />
                    <rect
                        x="64"
                        y={y + 8}
                        width={110 - row * 24}
                        height="4"
                        rx="2"
                        fill={LINE}
                    />
                    <rect
                        x="200"
                        y={y + 8}
                        width="16"
                        height="4"
                        rx="2"
                        fill={FAINT}
                    />
                </g>
            )
        })}
    </Sheet>
)

const ART = {
    [STANDARD_REPORT_NEXT_SECTION_KEY]: StandardReportArt,
    [DATA_SET_REPORT_NEXT_SECTION_KEY]: DataSetReportArt,
    [ORG_UNIT_DIST_REPORT_SECTION_KEY]: OrgUnitDistributionArt,
    [RESOURCE_SECTION_KEY]: ResourceArt,
}

export const SectionArt = ({ sectionKey }) => {
    const Art = ART[sectionKey]

    return Art ? <Art /> : null
}

SectionArt.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}
