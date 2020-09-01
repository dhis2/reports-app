/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

import TabularReport from '../TabularReport'

const content = {
    title: 'Bo - Child Health - Jan to Mar 2019',
    headers: [
        'Name',
        'Child Health Actual reports',
        'Child Health Expected reports',
        'Child Health Reporting rate',
        'Child Health Actual reports on time',
        'Child Health Reporting rate on time',
    ],
    rows: [
        ['Bo', '290.0', '378.0', '76.7', '290.0', '76.7'],
        ['Gbo', '3.0', '6.0', '50.0', '3.0', '50.0'],
    ],
}
const fileUrls = [
    {
        extension: 'xls',
        url: 'xls_url',
    },
    {
        extension: 'csv',
        url: 'csv_url',
    },
]

describe('<TabularReport/>', () => {
    it('Renders DownloadOptions and a ReportTable in a ReportLoader', () => {
        const wrapper = shallow(
            <TabularReport
                content={content}
                isLoading={false}
                fileUrls={fileUrls}
            />
        )
        expect(wrapper).toMatchSnapshot()
    })
})
