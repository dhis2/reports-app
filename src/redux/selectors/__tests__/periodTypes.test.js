import pluckPeriodTypes from '../periodTypes'

describe('pluckPeriodTypes', () => {
    const periodTypes = [{ name: 'Daily' }, { name: 'WeeklyWednesday' }]

    const expectedOutput = [
        { id: 'Daily', displayName: 'Daily' },
        { id: 'WeeklyWednesday', displayName: 'Weekly Wednesday' },
    ]

    it('transforms the input array correctly', () => {
        expect(pluckPeriodTypes(periodTypes)).toEqual(expectedOutput)
    })
})
