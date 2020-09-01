import React from 'react'

import { shallow } from 'enzyme'

import AppRouter from '../AppRouter'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({ OrgUnitTree: 'OrgUnitTree' }))

jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

const ownShallow = () => shallow(<AppRouter />)

it('AppRouter renders without crashing', () => {
    ownShallow()
})

it('Matches the snapshot', () => {
    expect(ownShallow()).toMatchSnapshot()
})
