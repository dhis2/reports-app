import { shallow } from 'enzyme'
import React from 'react'
import ReportLoader from '../ReportLoader.jsx'

describe('<ReportLoader/>', () => {
    it('Renders a loader when isLoading is true', () => {
        const wrapper = shallow(
            <ReportLoader content={{}} isLoading={true}>
                <div>Hello world</div>
            </ReportLoader>
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('Renders nothing when content is an empty object and isLoading is false', () => {
        const wrapper = shallow(
            <ReportLoader content={{}} isLoading={false}>
                <div>Hello world</div>
            </ReportLoader>
        )
        expect(wrapper.html()).toBeNull()
    })

    it('Renders its children when isLoading is false and content is non-empty', () => {
        const props = {
            content: { text: 'hello world' },
            isLoading: false,
        }
        const wrapper = shallow(
            <ReportLoader {...props}>
                <div>Hello world</div>
            </ReportLoader>
        )
        expect(wrapper.html()).toMatchSnapshot()
    })
})
