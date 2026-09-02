import PropTypes from 'prop-types'
import React from 'react'
import styles from './MalariaWeeklyBulletin.module.css'

/*
 * Weekly confirmed cases over the window, as an inline-SVG area chart. No
 * chart.js: the shape is simple, and keeping it as hand-drawn SVG makes the
 * whole plugin self-contained and prints cleanly.
 *
 * The viewBox is a fixed drawing space the CSS scales to the column width; all
 * the geometry below is in those user units, not pixels.
 */
const W = 640
const H = 220
const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

export const TrendChart = ({ series }) => {
    const values = series.map((w) => w.confirmed)
    const max = Math.max(...values, 1)
    /* A round-ish top so the axis label is a sensible number. */
    const top = Math.ceil(max / 50) * 50

    const plotW = W - PAD_L - PAD_R
    const plotH = H - PAD_T - PAD_B
    const stepX = plotW / (series.length - 1)

    const x = (i) => PAD_L + i * stepX
    const y = (v) => PAD_T + plotH * (1 - v / top)

    const linePoints = series
        .map((w, i) => `${x(i).toFixed(1)},${y(w.confirmed).toFixed(1)}`)
        .join(' ')

    const areaPath =
        `M ${x(0).toFixed(1)},${y(series[0].confirmed).toFixed(1)} ` +
        series
            .slice(1)
            .map((w, i) => `L ${x(i + 1).toFixed(1)},${y(w.confirmed).toFixed(1)}`)
            .join(' ') +
        ` L ${x(series.length - 1).toFixed(1)},${(H - PAD_B).toFixed(1)}` +
        ` L ${x(0).toFixed(1)},${(H - PAD_B).toFixed(1)} Z`

    /* Three horizontal gridlines: 0, half, top. */
    const gridValues = [0, top / 2, top]

    return (
        <svg
            className={styles.trendSvg}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Weekly confirmed malaria cases"
        >
            {gridValues.map((v) => (
                <g key={v}>
                    <line
                        x1={PAD_L}
                        x2={W - PAD_R}
                        y1={y(v)}
                        y2={y(v)}
                        stroke="#ccc"
                        strokeWidth="1"
                    />
                    <text
                        x={PAD_L - 6}
                        y={y(v) + 3}
                        textAnchor="end"
                        className={styles.axisLabel}
                    >
                        {Math.round(v)}
                    </text>
                </g>
            ))}

            <path d={areaPath} fill="rgba(0, 0, 0, 0.06)" />
            <polyline
                points={linePoints}
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {series.map((w, i) => (
                <circle
                    key={`${w.year}-${w.week}`}
                    cx={x(i)}
                    cy={y(w.confirmed)}
                    r={i === series.length - 1 ? 3 : 1.5}
                    fill="#000"
                />
            ))}

            {/* Label every other week so the axis does not crowd. */}
            {series.map((w, i) =>
                i % 2 === series.length % 2 ? (
                    <text
                        key={`x-${w.year}-${w.week}`}
                        x={x(i)}
                        y={H - PAD_B + 16}
                        textAnchor="middle"
                        className={styles.axisLabel}
                    >
                        {w.week}
                    </text>
                ) : null
            )}
        </svg>
    )
}

TrendChart.propTypes = {
    series: PropTypes.arrayOf(
        PropTypes.shape({
            confirmed: PropTypes.number,
            week: PropTypes.number,
            year: PropTypes.number,
        })
    ).isRequired,
}
