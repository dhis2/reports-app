/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* d2-ui components */
import { OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';

/* App components */
import { AvailableOrganisationUnitsTree } from './AvailableOrganisationUnitsTree';

/* fake data */
import fakerData from '../../utils/fakerTests';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    const onChange = jest.fn();
    return shallow(
        <AvailableOrganisationUnitsTree
            d2={fakerData.d2}
            onChange={onChange} />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <OrganisationUnitGroupSets /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should render no OrgUnitTree', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(OrgUnitTree)).toHaveLength(0);
    });

    it('Should render OrgUnitTree', () => {
        const wrapper = ownShallow();
        wrapper.setState({rootWithMembers: {}});
        expect(wrapper.find(OrgUnitTree)).toHaveLength(1);
    });
});
