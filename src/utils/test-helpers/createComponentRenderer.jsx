import { shallow } from 'enzyme'
import React from 'react'

export default function createComponentRenderer(Component, defaultProps) {
    return function (customProps) {
        const props = { ...defaultProps, ...customProps }
        return shallow(<Component {...props} />)
    }
}
