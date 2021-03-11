import { shallow } from 'enzyme'
import React from 'react'
import {
    DownloadOptions,
    DownloadOption,
} from '../../TabularReport/DownloadOptions'

describe('<DownloadOptions/>', () => {
    const fileUrls = [
        {
            extension: 'pdf',
            url: 'http://www.google.nl',
        },
        {
            extension: 'xls',
            url: 'http://www.google.com',
        },
    ]

    it('Renders an empty container when fileUrls is an empty array', () => {
        expect(shallow(<DownloadOptions fileUrls={[]} />)).toMatchSnapshot()
    })
    it('Renders an empty container when fileUrls is an empty array', () => {
        expect(
            shallow(<DownloadOptions fileUrls={fileUrls} />)
        ).toMatchSnapshot()
    })

    it('Will open PDF files in a new window (open in browser)', () => {
        const file = {
            extension: 'pdf',
            url: 'http://www.google.nl',
        }
        const wrapper = shallow(<DownloadOption file={file} id={0} />)
        const linkTarget = wrapper.find('a').prop('target')
        expect(linkTarget).toEqual('_blank')
    })

    it('Will open other files in the same window (download)', () => {
        const wrapper = shallow(<DownloadOption file={fileUrls[1]} id={1} />)
        const linkTarget = wrapper.find('a').prop('target')
        expect(linkTarget).toEqual('_self')
    })
})
