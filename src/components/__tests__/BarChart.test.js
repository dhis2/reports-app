import { shallow } from 'enzyme'
import React from 'react'
import { transformedChartData } from '../../__fixtures__/orgUnitDistReport.js'
import BarChart from '../BarChart.js'

describe('<BarChart/>', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(
            <BarChart content={transformedChartData} isLoading={false} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})
