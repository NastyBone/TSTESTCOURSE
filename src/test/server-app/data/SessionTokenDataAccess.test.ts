import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account, SessionToken } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock,
            }
        })
    }
})

describe.only('Test suite for users credentials data access', () => {
    let sut: SessionTokenDataAccess
    const someAccount: Account = {
        id: '',
        userName: 'userName',
        password: 'password'
    }
    const someId = 'a1b2'
    const nowDate = new Date(Date.now() + 60 * 60 * 1000);

    const someToken: SessionToken = {
        id: '',
        expirationDate: nowDate,
        valid: true,
        userName: someAccount.userName

    }
    beforeEach(() => {
        sut = new SessionTokenDataAccess()
        expect(DataBase).toHaveBeenCalledTimes(1);

    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('Should generate token', async () => {
        insertMock.mockResolvedValueOnce(someId)
        jest.spyOn(sut as any, 'generateExpirationTime').mockImplementation(() => {
            return nowDate;
        });
        const actual = await sut.generateToken(someAccount);
        expect(actual).toBe(someId)
        expect(insertMock).toHaveBeenCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: nowDate

        })
    })
    it('Should invalidate token', async () => {
        updateMock.mockResolvedValueOnce(undefined)
        const actual = await sut.invalidateToken(someId);
        expect(actual).toBeUndefined()
        expect(updateMock).toHaveBeenCalledWith(someId, 'valid', false)
    })
    it('Should check token', async () => {
        getByMock.mockResolvedValueOnce(someToken);
        const actual = await sut.isValidToken(someId);
        expect(actual).toBe(someToken.valid);
        expect(getByMock).toHaveBeenCalledWith('id', someId)
    })
})