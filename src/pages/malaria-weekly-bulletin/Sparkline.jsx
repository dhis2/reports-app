import PropTypes from 'prop-types'
import React from 'react'

/*
 * A tiny trend line for a stat tile — just enough to show which way the last
 * couple of months have gone. Inline SVG so it needs no charting library and
 * prints as crisp vector.
 */
export const Sparkline = ({
    values,
    width = 96,
    height = 28,
    stroke = '#1a1a1a',
}) => {
    if (!values || values.length < 2) {
        return null
    }

    const max = Math.max(...values)
    const min = Math.min(...values)
    const span = max - min || 1
    const stepX = width / (values.length - 1)

    /* Leave 2px of breathing room top and bottom so the peak is not clipped. */
    const y = (v) => 2 + (height - 4) * (1 - (v - min) / span)

    const points = values
        .map((v, i) => `${(i * stepX).toFixed(1)},${y(v).toFixed(1)}`)
        .join(' ')

    const lastX = (values.length - 1) * stepX
    const lastY = y(values[values.length - 1])

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
        >
            <polyline
                points={points}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <circle cx={lastX} cy={lastY} r="2" fill={stroke} />
        </svg>
    )
}

Sparkline.propTypes = {
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    height: PropTypes.number,
    stroke: PropTypes.string,
    width: PropTypes.number,
}
