/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core';

import { DataSetDimensions } from './DataSetDimensions';

/* fake data */
import fakerData from '../../utils/fakerTests';

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: ('DropDown'),
}));

const dimensions = [
    {
        id: 'dimensions1',
        displayName: 'dimension1',
        items: [{
            id: 'item1',
            displayName: 'item1',
        }],
    },
    {
        id: 'dimensions2',
        displayName: 'dimension2',
        items: [{
            id: 'item1',
            displayName: 'item1',
        }],
    }
];

const ownShallow = () => {
    const onChange = jest.fn();
    return shallow(
        <DataSetDimensions
            d2={fakerData.d2}
            onChange={onChange}
            values={{}}
            dataSetId="dataSetId"
        />,
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

    it('Should render no DropDown', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(DropDown)).toHaveLength(0);
    });

    it('Should render the correct number of div for each DropDown Component', () => {
        const wrapper = ownShallow();
        wrapper.setState({ dimensions: dimensions });
        const arrayWrapper = wrapper.first();       // Array wrapper for Dropdowns created by enzyme
        expect(arrayWrapper.find('div')).toHaveLength(dimensions.length);
    });
});