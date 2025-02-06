import { shallow } from 'enzyme'
import React from 'react'
import AppRouter from '../AppRouter.jsx'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({ OrgUnitTree: 'OrgUnitTree' }))

jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

const ownShallow = () => shallow(<AppRouter />)

it('AppRouter renders without crashing', () => {
    ownShallow()
})

it('Matches the snapshot', () => {
    expect(ownShallow()).toMatchSnapshot()
})
