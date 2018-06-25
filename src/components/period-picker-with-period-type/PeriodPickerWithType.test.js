/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* d2-ui components */
import { DropDown, PeriodPicker } from '@dhis2/d2-ui-core';

import { PeriodPickerWithPeriodType } from './PeriodPickerWithPeriodType';

/* fake data */
import fakerData from '../../helpers/fakerTests';

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: ('DropDown'),
    PeriodPicker: ('PeriodPicker'),
}));

const periodType = 'Weekly';

const ownShallow = () => {
    const onChange = jest.fn();
    return shallow(
        <PeriodPickerWithPeriodType
            d2={fakerData.d2}
            onChange={onChange}
        />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <PeriodPickerWithPeriodType /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should render DropDown for PeriodType', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(DropDown)).toHaveLength(1);
    });

    it('Should render d2-ui PeriodPicker when period type is defined', () => {
        const wrapper = ownShallow();
        wrapper.setState({ selectedPeriodType: periodType });
        expect(wrapper.find(PeriodPicker)).toHaveLength(1);
    });
});