import React from 'react'
import { shallow } from 'enzyme'
import ReportTable from '../../TabularReport/ReportTable'
import { transformedTableData } from '../../../__fixtures__/orgUnitDistReport'

describe('<ReportTable/>', () => {
    it('matches the snapshot for a given input', () => {
        const wrapper = shallow(<ReportTable content={transformedTableData} />)
        expect(wrapper).toMatchSnapshot()
    })
})
