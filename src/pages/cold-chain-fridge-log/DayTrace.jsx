import PropTypes from 'prop-types'
import React from 'react'
import styles from './ColdChainFridgeLog.module.css'
import { SAFE_MAX_C, SAFE_MIN_C } from './fridgeData.js'

/*
 * One day's temperature as a line across 24 hours, with the safe 2–8 °C band
 * shaded behind it. This is the thing a printed report can't give you: the
 * calendar shows a colour, you click the day, and here is what actually
 * happened hour by hour. Inline SVG, so no charting library and a clean print.
 *
 * Geometry is in viewBox user units the CSS scales to the column width.
 */
const W = 640
const H = 200
const PAD_L = 34
const PAD_R = 12
const PAD_T = 12
const PAD_B = 26

export const DayTrace = ({ hourly }) => {
    const min = Math.min(...hourly)
    const max = Math.max(...hourly)

    /* A fixed-ish domain that always contains the safe band, so the 2–8
     * shading is meaningful even on a flat, uneventful day. */
    const lo = Math.min(0, Math.floor(min - 1))
    const hi = Math.max(10, Math.ceil(max + 1))

    const plotW = W - PAD_L - PAD_R
    const plotH = H - PAD_T - PAD_B
    const stepX = plotW / (hourly.length - 1)

    const x = (i) => PAD_L + i * stepX
    const y = (t) => PAD_T + plotH * (1 - (t - lo) / (hi - lo))

    const linePoints = hourly
        .map((t, i) => `${x(i).toFixed(1)},${y(t).toFixed(1)}`)
        .join(' ')

    const bandTop = y(SAFE_MAX_C)
    const bandBottom = y(SAFE_MIN_C)

    const hourTicks = [0, 6, 12, 18]

    return (
        <svg
            className={styles.traceSvg}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Hourly fridge temperature"
        >
            {/* The safe band. */}
            <rect
                x={PAD_L}
                y={bandTop}
                width={plotW}
                height={bandBottom - bandTop}
                fill="rgba(30, 142, 90, 0.12)"
            />
            <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={bandTop}
                y2={bandTop}
                stroke="#7cc4a0"
                strokeDasharray="3 3"
            />
            <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={bandBottom}
                y2={bandBottom}
                stroke="#7cc4a0"
                strokeDasharray="3 3"
            />

            {/* The two band edges, labelled. */}
            <text x={PAD_L - 6} y={bandTop + 3} textAnchor="end" className={styles.traceAxis}>
                {SAFE_MAX_C}°
            </text>
            <text
                x={PAD_L - 6}
                y={bandBottom + 3}
                textAnchor="end"
                className={styles.traceAxis}
            >
                {SAFE_MIN_C}°
            </text>

            {/* Hour ticks along the bottom. */}
            {hourTicks.map((hour) => (
                <text
                    key={hour}
                    x={x(hour)}
                    y={H - PAD_B + 16}
                    textAnchor="middle"
                    className={styles.traceAxis}
                >
                    {`${String(hour).padStart(2, '0')}:00`}
                </text>
            ))}

            <polyline
                points={linePoints}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    )
}

DayTrace.propTypes = {
    hourly: PropTypes.arrayOf(PropTypes.number).isRequired,
}
