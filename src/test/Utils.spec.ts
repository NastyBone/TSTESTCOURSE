import { toUppercase } from "../app/Utils"

describe('Utils test suite', () => {
    it('Should convert a string to uppercase', () =>{
        const result = toUppercase('abc');
        expect(result).toBe('ABC');
    })
})