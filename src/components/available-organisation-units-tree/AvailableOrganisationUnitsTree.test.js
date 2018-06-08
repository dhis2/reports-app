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
import fakerData from '../../helpers/fakerTests';

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

it('AvaiableOrganisationUnitsTree renders without crashing', () => {
    ownShallow();
});

it('AvaiableOrganisationUnitsTree does not render OrgUnitTree', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(OrgUnitTree)).toHaveLength(0);
});

it('AvaiableOrganisationUnitsTree does render OrgUnitTree', () => {
    const wrapper = ownShallow();
    wrapper.setState({rootWithMembers: {}});
    expect(wrapper.find(OrgUnitTree)).toHaveLength(1);
});