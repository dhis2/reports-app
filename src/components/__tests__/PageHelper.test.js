/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* App components */
import PageHelper from './PageHelper'

const ownShallow = () => {
    return shallow(<PageHelper url="http://dummy.com" />)
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

it('Page Helper renders without crashing.', () => {
    ownShallow()
})
