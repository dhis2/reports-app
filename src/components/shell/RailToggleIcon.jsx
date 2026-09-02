import PropTypes from 'prop-types'
import React from 'react'

/*
 * The two states of the options rail, drawn as the panel itself rather than
 * as a bare chevron: a chevron says "something moves left", while this says
 * which panel it is and what will happen to it.
 *
 * Drawn in currentColor so the button around it owns the colour, and its
 * hover and focus states carry the icon with them.
 */
export const RailToggleIcon = ({ collapsed }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        version="1.1"
        fill="none"
        style={{ width: 16, height: 16 }}
        aria-hidden="true"
        focusable="false"
    >
        <rect
            x="1.5"
            y="1.5"
            width="13"
            height="13"
            rx="1.5"
            stroke="currentColor"
        />
        <rect x="9" y="2" width="1" height="12" fill="currentColor" />

        {collapsed ? (
            <>
                {/* The panel that is currently put away. */}
                <rect
                    x="10"
                    y="2"
                    width="4"
                    height="12"
                    fill="currentColor"
                    fillOpacity="0.2"
                />
                <path d="M4 10V6L7 8L4 10Z" fill="currentColor" />
            </>
        ) : (
            <path d="M7 6V10L4 8L7 6Z" fill="currentColor" />
        )}
    </svg>
)

RailToggleIcon.propTypes = {
    collapsed: PropTypes.bool,
}
