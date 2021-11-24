import { shallow } from 'enzyme'
import React from 'react'
import PageHelper from '../PageHelper.js'

const ownShallow = () => {
    return shallow(<PageHelper url="http://dummy.com" />)
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

it('Page Helper renders without crashing.', () => {
    ownShallow()
})
