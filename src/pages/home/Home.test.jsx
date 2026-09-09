import { shallow } from 'enzyme'
import React from 'react'
import { navGroups } from '../../components/shell/navigation.js'
import Home from './Home.jsx'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

const sectionCount = navGroups.reduce(
    (total, group) => total + group.items.length,
    0
)

const ownShallow = () =>
    shallow(<Home />, {
        disableLifecycleMethods: true,
    })

describe('Test <Home /> rendering:', () => {
    let wrapper

    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing.', () => {
        ownShallow()
    })

    it('Renders one card per section.', () => {
        expect(wrapper.find('[data-test="menu-element"]')).toHaveLength(
            sectionCount
        )
    })
})
