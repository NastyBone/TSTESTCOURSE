import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler"
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn()

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}))

describe.only('Test Suite for RegisterHandler', () => {
    let sut: RegisterHandler;

    const requestMock = {
        method: undefined,
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    }
    const authorizerMock = {
        registerUser: jest.fn(),
    }

    const someId: number = 0;
    const someAccount: Account = {
        id: '',
        userName: 'someUsername',
        password: 'somePassword',
    }
    beforeEach(() => {
        sut = new RegisterHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any,
        );
    })

    afterEach(() => {
        jest.clearAllMocks()
    })


    it('Should register an user', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(someId)

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({
            userId: someId,
        }))
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    })
})