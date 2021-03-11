import { shallow } from 'enzyme'
import React from 'react'
import { transformedChartData } from '../../__fixtures__/orgUnitDistReport'
import BarChart from '../BarChart'

describe('<BarChart/>', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(
            <BarChart content={transformedChartData} isLoading={false} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})
