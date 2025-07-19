import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock
            }
        })
    }
})


describe('Test suite for users credentials data access', () => {

    let sut: UserCredentialsDataAccess;
    const someAccount: Account = {
        id: '',
        userName: 'userName',
        password: 'password'
    }
    const someId =  '1234';

    beforeEach(() => {
        sut = new UserCredentialsDataAccess()
        expect(DataBase).toHaveBeenCalledTimes(1)

    })

    afterEach(()=> {
        jest.clearAllMocks()
    })
    it('should create an user and return its id', async () => {
        insertMock.mockResolvedValueOnce(someId);
        const actual = await sut.addUser(someAccount);
        expect(actual).toBe(someId)
        expect(insertMock).toHaveBeenCalledWith(someAccount);
    });
    it('should retrieve the user value by its id', async () => {
        getByMock.mockResolvedValueOnce(someAccount);
        const actual = await sut.getUserById(someId)
        expect(actual).toEqual(someAccount)
        expect(getByMock).toHaveBeenCalledWith('id', someId);
    });
    it('should retrieve the user value by its username', async () => {
        getByMock.mockResolvedValueOnce(someAccount);
        const actual = await sut.getUserByUserName(someAccount.userName);
        expect(actual).toEqual(someAccount)
        expect(getByMock).toHaveBeenCalledWith('userName', someAccount.userName);
    });
})