import { shallow } from 'enzyme'
import React from 'react'
import {
    DownloadOptions,
    DownloadOption,
} from '../../TabularReport/DownloadOptions.jsx'

describe('<DownloadOptions />', () => {
    const fileUrls = [
        { extension: 'pdf', url: 'http://www.google.nl' },
        { extension: 'xls', url: 'http://www.google.com' },
    ]

    it('renders no <DownloadOption /> when fileUrls is empty', () => {
        const wrapper = shallow(<DownloadOptions fileUrls={[]} />)
        expect(wrapper.find(DownloadOption)).toHaveLength(0)
    })

    it('renders one <DownloadOption /> per file', () => {
        const wrapper = shallow(<DownloadOptions fileUrls={fileUrls} />)
        expect(wrapper.find(DownloadOption)).toHaveLength(fileUrls.length)
    })
})

describe('<DownloadOption />', () => {
    it('opens PDF files in a new window', () => {
        const file = { extension: 'pdf', url: 'http://www.google.nl' }
        const wrapper = shallow(<DownloadOption file={file} />)
        expect(wrapper.find('a').prop('target')).toBe('_blank')
    })

    it('opens non-PDF files in the same window', () => {
        const file = { extension: 'xls', url: 'http://www.google.com' }
        const wrapper = shallow(<DownloadOption file={file} />)
        expect(wrapper.find('a').prop('target')).toBe('_self')
    })

    it('renders the correct text for the link', () => {
        const file = { extension: 'pdf', url: 'http://www.google.nl' }
        const wrapper = shallow(<DownloadOption file={file} />)
        expect(wrapper.text().toLowerCase()).toContain('download as pdf')
    })

    it('renders the correct href', () => {
        const file = { extension: 'xls', url: 'http://www.google.com' }
        const wrapper = shallow(<DownloadOption file={file} />)
        expect(wrapper.find('a').prop('href')).toBe(file.url)
    })
})
