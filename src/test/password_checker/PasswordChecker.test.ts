import { PasswordChecker } from "../../app/password_checker/PasswordChecker";

describe('Testing for password checker', () => {
    let sut: PasswordChecker

    beforeEach(() => {
        sut = new PasswordChecker()
    })

    describe('First iteration', () => {
        // Has to have more than 8 characters
        it('Should be valid a password with 8 characters', () => {
            const actual = sut.PasswordChecker('12345678aA');
            expect(actual).toBe(true);
        })
        it('Should fail on password with less than 8 characters length', () => {
            const actual = sut.PasswordChecker('1234567');
            expect(actual).toBe(false);
        })
        // Should have at least one uppercase character
        it('Should be valid to have one lowercase letter', () => {
            const actual = sut.PasswordChecker('1234567aA');
            expect(actual).toBe(true);
        })
        it('Should fail on not having at least one lowercase letter', () => {
            const actual = sut.PasswordChecker('1234567A');
            expect(actual).toBe(false);
        })
        // Should have at least one lowecase character
        it('Should be valid to have one uppecarse letter', () => {
            const actual = sut.PasswordChecker('1234567aA');
            expect(actual).toBe(true);
        })
        it('Should fail on not having at least one uppercase letter', () => {
            const actual = sut.PasswordChecker('1234567a');
            expect(actual).toBe(false);
        })
    })
})