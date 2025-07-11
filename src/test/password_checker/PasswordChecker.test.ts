import { PasswordChecker, PasswordErrors } from "../../app/password_checker/PasswordChecker";

describe('Testing for password checker', () => {
    let sut: PasswordChecker

    beforeEach(() => {
        sut = new PasswordChecker()
    })

    describe('First iteration', () => {
        // Has to have more than 8 characters
        it('Should be valid a password with 8 characters', () => {
            const actual = sut.PasswordChecker('12345678');
            expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
        })
        it('Should fail on password with less than 8 characters length', () => {
            const actual = sut.PasswordChecker('1234567');
            expect(actual.valid).toBe(false);
            expect(actual.reasons).toContain(PasswordErrors.SHORT);
        })
        // Should have at least one uppercase character
        it('Should be valid to have one lowercase letter', () => {
            const actual = sut.PasswordChecker('aBCD');
            expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE);
        })
        it('Should fail on not having at least one lowercase letter', () => {
            const actual = sut.PasswordChecker('ABCD');
            expect(actual.valid).toBe(false);
            expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE)
        })
        // Should have at least one lowecase character
        it('Should be valid to have one uppecarse letter', () => {
            const actual = sut.PasswordChecker('Abcd');
            expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE);
        })
        it('Should fail on not having at least one uppercase letter', () => {
            const actual = sut.PasswordChecker('abcd');
            expect(actual.valid).toBe(false);
            expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
        })
        it('Should be valid on complex and correct passwords', () => {
            const actual = sut.PasswordChecker('Abc123456')
            expect(actual.valid).toBe(true);
            expect(actual.reasons).toHaveLength(0)
        })
    })
})