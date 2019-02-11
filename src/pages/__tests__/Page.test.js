import React from 'react'
import { shallow } from 'enzyme'
import Page from '../Page'
import Home from '../home/Home'

jest.mock('../Page') // Page is now a mock constructor
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

describe('Page test', function() {
    const notPageComponentShallow = () => shallow(<Home t={jest.fn()} />)

    beforeEach(() => Page.mockClear())

    it('Page constructor is called', () => {
        const page = new Page()
        expect(Page).toHaveBeenCalled()
    })

    it('Not Page component does not call page constructor', () => {
        notPageComponentShallow()
        expect(Page).toHaveBeenCalledTimes(0)
    })
})
