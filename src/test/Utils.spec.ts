import { toUppercase } from "../app/Utils"

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
})