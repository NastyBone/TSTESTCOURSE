import { calculateStringComplexity, toUppercaseWithCb } from "../../app/doubles/OtherUtils"

describe('OtherUtils test suite', () => {
    it('should calculate complexity of a stringObject correctly', () => {
        const stub = {
            length: 5,
            extraInfo: {
                field1: 'some',
                field2: 'info'
            }
        }

        expect(calculateStringComplexity(stub as any)).toBe(10)
    })

    // In fakes, jest mislead the behaviour of the callback, being it invalid but passes coverage
    it('should return valid uppercase with callback', () => {
        const actual = toUppercaseWithCb('abc', ()=>{});
        expect(actual).toBe('ABC');
    })
    it('should return invalid uppercase with callback', () => {
        const actual = toUppercaseWithCb('', ()=>{});
        expect(actual).toBeUndefined();
    })
})