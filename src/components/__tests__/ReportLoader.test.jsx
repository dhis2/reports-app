import { shallow } from 'enzyme'
import React from 'react'
import ReportLoader from '../ReportLoader.jsx'

describe('<ReportLoader/>', () => {
    it('renders a CircularProgress when loading', () => {
        const wrapper = shallow(
            <ReportLoader content={{}} isLoading={true}>
                <div>Hello</div>
            </ReportLoader>
        )
        expect(wrapper.find('CircularProgress').exists()).toBe(true)
    })

    it('renders nothing when empty content & not loading', () => {
        const wrapper = shallow(
            <ReportLoader content={{}} isLoading={false}>
                <div>Hello</div>
            </ReportLoader>
        )
        expect(wrapper.type()).toBeNull()
    })

    it('renders children when not loading and content is non-empty', () => {
        const wrapper = shallow(
            <ReportLoader content={{ foo: 'bar' }} isLoading={false}>
                <div>Hello</div>
            </ReportLoader>
        )
        expect(wrapper.contains(<div>Hello</div>)).toBe(true)
    })
})
