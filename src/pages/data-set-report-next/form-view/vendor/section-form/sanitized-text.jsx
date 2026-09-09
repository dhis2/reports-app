import DOMPurify from 'dompurify'
import PropTypes from 'prop-types'
import React from 'react'

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if (node.tagName.toLowerCase() === 'a') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noreferrer')
    }
})

export const SanitizedText = ({ children, className }) => {
    if (!children) {
        return null
    }
    const html = DOMPurify.sanitize(children, {
        ALLOWED_TAGS: ['a', 'b', 'strong', 'u', 'em'],
    })

    return (
        <p className={className} dangerouslySetInnerHTML={{ __html: html }}></p>
    )
}

SanitizedText.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}
