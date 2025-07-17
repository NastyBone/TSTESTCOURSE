import { calculateStringComplexity } from "../../app/doubles/OtherUtils"

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
})