import React from 'react'
import createComponentRenderer from '../createComponentRenderer.jsx'

describe('createComponentRenderer', () => {
    const MockComponent = (props) => <div {...props} />
    const defaultProps = { prop1: '1', prop2: '2' }
    const componentRenderer = createComponentRenderer(
        MockComponent,
        defaultProps
    )

    it('returns a function', () => {
        expect(typeof componentRenderer).toEqual('function')
    })
    it('the created function returns a component with default props when called without any arguments', () => {
        expect(componentRenderer().props()).toEqual(defaultProps)
    })
    it('the default props are merged with custom props when provided as an argument', () => {
        const customProps = { prop2: 'not 2', prop3: '3' }
        const mergedProps = { ...defaultProps, ...customProps }
        expect(componentRenderer(customProps).props()).toEqual(mergedProps)
    })
})
