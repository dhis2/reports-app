import React from 'react'
import { shallow } from 'enzyme'

export default function createComponentRenderer(Component, defaultProps) {
    return function(customProps) {
        const props = { ...defaultProps, ...customProps }
        return shallow(<Component {...props} />)
    }
}
