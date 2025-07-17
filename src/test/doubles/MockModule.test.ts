// You can specify which ones want to preserve as implemented
jest.mock('../../app/doubles/OtherUtils', () => ({
    ...jest.requireActual('../../app/doubles/OtherUtils'),
    calculateStringComplexity: () => 10,
}));
// Mock external modules
jest.mock('uuid', () => ({
    v4: () => '123',
}))

import * as OtherUtils from '../../app/doubles/OtherUtils';
describe('Mocking modules', () => {
    test('calculate string complexity', () => {
        // Jest mock substitutes functions implementations, making them empty, practically
        const actual = OtherUtils.calculateStringComplexity({} as any);
        expect(actual).toBe(10);
    })

    test('keep other functions', () => {
        const actual = OtherUtils.toLowerCase('ABC');
        expect(actual).toBe('abc');
    })

    test('string with id', () => {
        const actual = OtherUtils.toUpperCaseWithId('abc');
        expect(actual).toBe('ABC123');
    })
})