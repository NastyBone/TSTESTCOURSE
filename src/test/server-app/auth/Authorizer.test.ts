import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Account } from "../../../app/server_app/model/AuthModel";


// SessionTokenDataAccess Mock
const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock('../../../app/server_app/data/SessionTokenDataAccess', () => {
    return {
        SessionTokenDataAccess: jest.fn().mockImplementation(() => {
            return {
                isValidToken: isValidTokenMock,
                generateToken: generateTokenMock,
                invalidateToken: invalidateTokenMock,
            }
        })
    }
})

// UserCredentialsDataAccess Mock

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock('../../../app/server_app/data/UserCredentialsDataAccess', () => {
    return {
        UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
            return {
                addUser: addUserMock,
                getUserByUserName: getUserByUserNameMock
            }
        })
    }
})
describe('Authorizer Test Suite', () => {
    let sut: Authorizer
    const mockTokenId = 'someTokenId123';
    const mockUserId = 'someUserId123'
    const mockAccount: Account = {
        id: '',
        userName: 'userName',
        password: 'password'
    }

    beforeEach(() => {
        sut = new Authorizer();
    })
    afterEach(() => {
        jest.clearAllMocks();
    })
    it('Should validate token', async () => {
        isValidTokenMock.mockReturnValueOnce(true);
        const result = await sut.validateToken(mockTokenId);
        expect(isValidTokenMock).toHaveBeenCalledTimes(1);
        expect(isValidTokenMock).toHaveBeenCalledWith(mockTokenId)
        expect(result).toBeTruthy()
    })
    it('Should register user', async () => {
        addUserMock.mockReturnValueOnce(mockUserId)
        const result = await sut.registerUser(mockAccount.userName, mockAccount.password);
        expect(result).toEqual(mockUserId);
        expect(addUserMock).toHaveBeenCalledTimes(1);
        expect(addUserMock).toHaveBeenCalledWith(mockAccount);

    })
    it('Should login', async () => {
        getUserByUserNameMock.mockReturnValueOnce(mockAccount);
        generateTokenMock.mockReturnValueOnce(mockTokenId)
        const result = await sut.login(mockAccount.userName, mockAccount.password)
        expect(result).toEqual(mockTokenId);
        expect(getUserByUserNameMock).toHaveBeenCalledTimes(1);
        expect(getUserByUserNameMock).toHaveBeenCalledWith(mockAccount.userName);
        expect(generateTokenMock).toHaveBeenCalledTimes(1)
        expect(generateTokenMock).toHaveBeenCalledWith(mockAccount)
    })
    it('Should logout', async () => {
        invalidateTokenMock.mockImplementationOnce(void null);
        await sut.logout(mockTokenId);
        expect(invalidateTokenMock).toHaveBeenCalledTimes(1);
        expect(invalidateTokenMock).toHaveBeenCalledWith(mockTokenId);
    })

    it('Should not proceed if password doesnt match on login', async () => {
        getUserByUserNameMock.mockReturnValueOnce(mockAccount);
        const someIncorrectPassword = 'SomeIncorrectPassword123'
        const result = await sut.login(mockAccount.userName, someIncorrectPassword);
        expect(result).toBeFalsy();
        expect(getUserByUserNameMock).toHaveBeenCalledTimes(1);
        expect(getUserByUserNameMock).toHaveBeenCalledWith(mockAccount.userName);
        expect(generateTokenMock).not.toHaveBeenCalled();
    })

        it('Should not proceed if user is not found', async () => {
        getUserByUserNameMock.mockReturnValueOnce(null);
        const result = await sut.login(mockAccount.userName, mockAccount.password);

        expect(result).toBeFalsy();
        expect(getUserByUserNameMock).toHaveBeenCalledTimes(1);
        expect(getUserByUserNameMock).toHaveBeenCalledWith(mockAccount.userName);
        expect(generateTokenMock).not.toHaveBeenCalled();
    })

    it('Should return token invalid', async () => {
        isValidTokenMock.mockReturnValueOnce(false);
        const result = await sut.validateToken(mockTokenId);
        expect(isValidTokenMock).toHaveBeenCalledTimes(1);
        expect(isValidTokenMock).toHaveBeenCalledWith(mockTokenId)
        expect(result).toBeFalsy()
    })

})