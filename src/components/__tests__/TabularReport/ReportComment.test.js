import React from 'react'
import { shallow } from 'enzyme'
import { ReportComment } from '../../TabularReport/ReportComment'

describe('<ReportComment/>', () => {
    it('Matches the snapshot', () => {
        const props = {
            comment: 'I want to comment on this',
            shareDataSetReportComment: jest.fn(),
            setDataSetReportComment: jest.fn(),
        }
        const wrapper = shallow(<ReportComment {...props} />)
        expect(wrapper).toMatchSnapshot()
    })
})
