import { InputField } from '@dhis2/d2-ui-core'
import { shallow } from 'enzyme'
import React from 'react'
import { ReportComment } from '../../TabularReport/ReportComment.jsx'

describe('<ReportComment/>', () => {
    const baseProps = {
        comment: 'I want to comment on this',
        shareDataSetReportComment: jest.fn(),
        setDataSetReportComment: jest.fn(),
    }

    it('renders the InputField with the given comment', () => {
        const wrapper = shallow(<ReportComment {...baseProps} />)
        const input = wrapper.find(InputField)

        expect(input.exists()).toBe(true)
        expect(input.prop('value')).toBe(baseProps.comment)
    })

    it('renders a button with text "Share"', () => {
        const wrapper = shallow(<ReportComment {...baseProps} />)
        const button = wrapper.find('button#main-action-button')

        expect(button.exists()).toBe(true)
        expect(button.text()).toBe('Share')
    })

    it('disables the button if comment is empty', () => {
        const wrapper = shallow(<ReportComment {...baseProps} comment="" />)
        const button = wrapper.find('button#main-action-button')
        expect(button.prop('disabled')).toBe(true)
    })

    it('enables the button if comment is non-empty', () => {
        const wrapper = shallow(<ReportComment {...baseProps} />)
        const button = wrapper.find('button#main-action-button')
        expect(button.prop('disabled')).toBe(false)
    })

    it('calls setDataSetReportComment when InputField changes', () => {
        const wrapper = shallow(<ReportComment {...baseProps} />)
        wrapper.find(InputField).simulate('change', { value: 'new comment' })
        expect(baseProps.setDataSetReportComment).toHaveBeenCalledWith({
            value: 'new comment',
        })
    })

    it('calls shareDataSetReportComment when button is clicked', () => {
        const wrapper = shallow(<ReportComment {...baseProps} />)
        wrapper.find('button#main-action-button').simulate('click')
        expect(baseProps.shareDataSetReportComment).toHaveBeenCalled()
    })
})
