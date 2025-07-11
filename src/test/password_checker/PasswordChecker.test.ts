import { PasswordChecker } from "../../app/password_checker/PasswordChecker";

describe('Testing for password checker', () => {
    let sut: PasswordChecker

    beforeEach(() => {
        sut = new PasswordChecker()
    })
    it('Should do nothing', () => {
        sut.PasswordChecker();
    })
})