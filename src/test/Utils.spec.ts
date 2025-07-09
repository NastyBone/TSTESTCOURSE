import { getStringInfo, toUppercase } from "../app/Utils"

describe('Utils test suite', () => {
    it('Should convert a string to uppercase', () =>{
        // arrange
        const expected = 'ABC';
        const sut = toUppercase;
        // act
        const actual = sut('abc')
        // assert
        expect(actual).toBe(expected)
    })

    describe('getStringInfo for My-String arg', () => {
        test('lowercase should be my-string', () => {
            const actual = getStringInfo('My-String');
            expect(actual.lowerCase).toBe('my-string');

        })
        test('uppercase should be MY-STRING', () => {
            const actual = getStringInfo('My-String');
            expect(actual.upperCase).toBe('MY-STRING');
        })

        test('length should be 9', () => {
            const actual = getStringInfo('My-String');
            expect(actual).toHaveLength(9);
        })

        test('should have the right characters', () => {
            const actual = getStringInfo('My-String');
            expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g']);
            expect(actual.characters).toContain<string>('M');
            expect(actual.characters).toEqual(expect.arrayContaining(['i', 'n', 'g','M', 'y', '-', 'S', 't', 'r']));
        })

        test('should return defined extraInfo', () => {
            const actual = getStringInfo('My-String');
            expect(actual).toBeDefined();
        })

        test('should return right extraInfo', () => {
            const actual = getStringInfo('My-String');
            expect(actual.extraInfo).toEqual({});
        })
    })
    // it('should return valid info from a string', () => {
    //     const actual = getStringInfo('My-String');

    //     // Regular strings
    //     expect(actual.lowerCase).toBe('my-string');
    //     expect(actual.upperCase).toBe('MY-STRING');

    //     // Length and quantity
    //     expect(actual).toHaveLength(9);
    //     expect(actual.length).toBe(9)

    //     // Characters and strings chains
    //     expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g']);
    //     expect(actual.characters).toContain<string>('M');
    //     expect(actual.characters).toEqual(expect.arrayContaining(['i', 'n', 'g','M', 'y', '-', 'S', 't', 'r']));

    //     // Objects - Requires toEqual, not toBe
    //     expect(actual.extraInfo).toEqual({});

    //     // Definition and truthiness
    //     expect(actual).toBeDefined();
    //     expect(actual).toBeTruthy();
    //     expect(actual).not.toBe(undefined);
    //     expect(actual).not.toBeUndefined();
    //     expect(actual).not.toBeNull();

        
    // })
})