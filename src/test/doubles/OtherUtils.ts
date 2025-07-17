import { calculateStringComplexity, OtherStringUtils, toUppercaseWithCb } from "../../app/doubles/OtherUtils"

describe('OtherUtils test suite', () => {

    describe('Testing otherStringUtils with spies', () => {
        let sut: OtherStringUtils

        beforeEach(() => {
            sut = new OtherStringUtils()
        })

        test('Use spy to track calls', () =>{
            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase');
            sut.toUpperCase('asa')
            expect(toUpperCaseSpy).toHaveBeenCalledWith('asa')
        })
        test('Use spy to track calls on other methods', () =>{
            const consoleLogSpy = jest.spyOn(console, 'log');
            sut.logString('abc');
            expect(consoleLogSpy).toHaveBeenCalledWith('abc')
        })
        // Bad practice. Dont do it
        test('Use spy to mock functions implementations', () =>{
            const callExternalServiceMock = jest.spyOn(sut as any, 'callExternalService').mockImplementation(() => {
                console.log('Overriding function implementation');
            });
            (sut as any).callExternalService();
        })
    })

    describe('tracking calls', () => {
        let argsCb = [];
        let timesCalled = 0;

        afterEach(() => {
            argsCb = [];
            timesCalled = 0;
        })
        const trackingFunction = (arg: string) => {
            argsCb.push(arg);
            timesCalled++;
        }

        it('should return valid uppercase with callback', () => {
            const actual = toUppercaseWithCb('abc', trackingFunction);
            expect(actual).toBe('ABC');
            expect(argsCb).toContain('Tested with string abc')
            expect(timesCalled).toEqual(1);
        })
        it('should return invalid uppercase with callback', () => {
            const actual = toUppercaseWithCb('', trackingFunction);
            expect(actual).toBeUndefined();
            expect(argsCb).toContain('Invalid String')
            expect(timesCalled).toEqual(1);
        })

    })

    describe('tracking calls with jest', () => {

        afterEach(() => {
            trackingFunction = jest.fn();
        })
        let trackingFunction = jest.fn();

        it('should return valid uppercase with callback', () => {
            const actual = toUppercaseWithCb('abc', trackingFunction);
            expect(actual).toBe('ABC');
            expect(trackingFunction).toHaveBeenCalledWith('Tested with string abc')
            expect(trackingFunction).toHaveBeenCalledTimes(1);
        })
        it('should return invalid uppercase with callback', () => {
            const actual = toUppercaseWithCb('', trackingFunction);
            expect(actual).toBeUndefined();
            expect(trackingFunction).toHaveBeenCalledWith('Invalid String')
            expect(trackingFunction).toHaveBeenCalledTimes(1);
        })
    })
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
        const actual = toUppercaseWithCb('abc', () => { });
        expect(actual).toBe('ABC');
    })
    it('should return invalid uppercase with callback', () => {
        const actual = toUppercaseWithCb('', () => { });
        expect(actual).toBeUndefined();
    })
})