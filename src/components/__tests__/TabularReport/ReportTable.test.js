import React from 'react'
import { shallow } from 'enzyme'
import ReportTable, { Row } from '../../TabularReport/ReportTable'
import { transformedTableData } from '../../../__fixtures__/orgUnitDistReport'

describe('<ReportTable/>', () => {
    it('matches the snapshot for a given input', () => {
        const wrapper = shallow(<ReportTable content={transformedTableData} />)
        expect(wrapper).toMatchSnapshot()
    })
})

describe('<Row/>', () => {
    it('produces tr and td elements', () => {
        const cells = ['a', 'b', 'c', 'd']
        const wrapper = shallow(<Row cells={cells} />)
        expect(wrapper).toMatchSnapshot()
    })
})
