import React from 'react'
import { shallow } from 'enzyme'
import BarChart from '../BarChart'
import { transformedChartData } from '../../__fixtures__/orgUnitDistReport'

describe('<BarChart/>', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<BarChart content={transformedChartData} />)
        expect(wrapper).toMatchSnapshot()
    })
})
