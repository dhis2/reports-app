/*
 * The URL is what makes a report linkable, so the round trip has to hold: a
 * selection written into the search string has to come back out unchanged,
 * and a search string with nothing of ours in it has to be recognised as
 * such, or the remembered selection is never reached.
 */

import { deserialise, serialise } from '../useOrgUnitDistSelection.js'

const selection = {
    ouPath: '/ImspTQPwCqd/O6uvpzGd5pu',
    groupSetId: 'Bpx0589u8y0',
}

describe('the URL round trip', () => {
    it('comes back out as it went in', () => {
        expect(deserialise(serialise(selection))).toEqual(selection)
    })

    it('names the parameters the way the current page does', () => {
        expect(serialise(selection)).toBe(
            '?ou=%2FImspTQPwCqd%2FO6uvpzGd5pu&ougs=Bpx0589u8y0'
        )
    })

    it('writes nothing for an empty selection', () => {
        expect(serialise({ ouPath: '', groupSetId: '' })).toBe('')
    })

    it('keeps a half-made selection, so a shared link can be finished', () => {
        expect(
            deserialise(serialise({ ouPath: '/abc', groupSetId: '' }))
        ).toEqual({ ouPath: '/abc', groupSetId: '' })
    })

    it('reports nothing in the URL as null, rather than as an empty selection', () => {
        expect(deserialise('')).toBeNull()
        expect(deserialise('?something=else')).toBeNull()
    })
})
