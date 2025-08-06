import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler"
import { Account } from "../../../app/server_app/model/AuthModel"
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel"

const getRequestBodyMock = jest.fn()
jest.mock("../../../app/server_app/utils/Utils", () => ({
    getRequestBody: () => getRequestBodyMock()
}))
describe('Test suite for LoginHandler class', () => {
    let sut: LoginHandler
    const requestMock = {
        method: undefined,
    }
    const responseMock = {
        statusCode: 0,
        write: jest.fn(),
        writeHead: jest.fn(),
    }
    const authorizerMock = {
        login: jest.fn(),
    }

    const someToken = 'token123ABC'
    const someAccount: Account = {
        id: '',
        userName: 'someUsername',
        password: 'somePassword',
    }

    beforeEach(() => {
        sut = new LoginHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should login the user sucessfully', async () => {
        getRequestBodyMock.mockResolvedValueOnce(someAccount)
        requestMock.method = HTTP_METHODS.POST;
        authorizerMock.login.mockResolvedValueOnce(someToken)

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED)
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ token: someToken }))
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    })

    it('Should throw an error when no data provided', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify("userName and password required"))
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' })
    })

    it('Should do nothing when invalid HTTP method passed', async () => {
        requestMock.method = HTTP_METHODS.GET;
        await sut.handleRequest();

        expect(responseMock.write).not.toHaveBeenCalled()
        expect(responseMock.writeHead).not.toHaveBeenCalled()
        expect(authorizerMock.login).not.toHaveBeenCalled()
    })
})