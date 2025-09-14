import { shallow } from 'enzyme'
import React from 'react'
import { transformedTableData } from '../../../__fixtures__/orgUnitDistReport.js'
import ReportTable, { Row } from '../../TabularReport/ReportTable.jsx'

describe('<ReportTable />', () => {
    it('renders the table title', () => {
        const wrapper = shallow(<ReportTable content={transformedTableData} />)
        expect(wrapper.find('h1').text()).toBe(transformedTableData.title)
    })

    it('renders the correct number of headers', () => {
        const wrapper = shallow(<ReportTable content={transformedTableData} />)
        const headers = wrapper.find('th')
        expect(headers).toHaveLength(transformedTableData.headers.length)
        expect(headers.at(0).text()).toBe(transformedTableData.headers[0])
    })

    it('renders the correct number of rows', () => {
        const wrapper = shallow(<ReportTable content={transformedTableData} />)
        const rows = wrapper.find(Row)
        expect(rows).toHaveLength(transformedTableData.rows.length)
    })
})

describe('<Row />', () => {
    it('renders one <td> per cell', () => {
        const cells = ['a', 'b', 'c', 'd']
        const wrapper = shallow(<Row cells={cells} />)
        const tds = wrapper.find('td')

        expect(tds).toHaveLength(cells.length)
        expect(tds.at(0).text()).toBe('a')
        expect(tds.at(1).text()).toBe('b')
        expect(tds.at(2).text()).toBe('c')
        expect(tds.at(3).text()).toBe('d')
    })

    it('applies centered class to non-first cells', () => {
        const cells = ['a', 'b']
        const wrapper = shallow(<Row cells={cells} />)
        const tds = wrapper.find('td')

        expect(tds.at(0).prop('data-test')).toBe('cell-left')
        expect(tds.at(1).prop('data-test')).toBe('cell-centered')
    })
})
