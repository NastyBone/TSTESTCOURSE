import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./utils/ResponseTestWrapper";

jest.mock("../../app/server_app/data/DataBase")
const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();
const serverMock = {
    listen: () => { },
    close: () => { },
}
jest.mock('http', () => ({
    createServer: (cb: Function) => {
        cb(requestWrapper, responseWrapper)
        return serverMock
    }
}))

const spyOnGetBy = jest.spyOn(DataBase.prototype, 'getBy');
const spyOnInsert = jest.spyOn(DataBase.prototype, 'insert')

describe('Test suite for Login Requests', () => {
    const someAccount = {
        userName: 'userName',
        password: 'password',
    }
    const someToken = 'someToken';

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.resetAllMocks();
    })
    beforeEach(() => {
        requestWrapper.headers["user-agent"] = "Windows"
    })

    // Login Success
    it('Should login successfully with valid credentials', async () => {
        requestWrapper.url = 'localhost:8080/login';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = someAccount;
        spyOnGetBy.mockResolvedValueOnce(someAccount)
        spyOnInsert.mockResolvedValueOnce(someToken);


        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual({ token: someToken })

    })

    // Not found case
    it('Should not login if credentials are not valid', async () => {
        requestWrapper.url = 'localhost:8080/login';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'OtherUsername',
            password: 'OtherPassword',
        };
        spyOnGetBy.mockResolvedValueOnce({
            userName: 'OtherUsername',
            password: 'OtherPassword',
        })

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(responseWrapper.body).toEqual('wrong username or password')

    })

    // Bad request case
    it('Should throw error if credentials missing', async () => {
        requestWrapper.url = 'localhost:8080/login';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        await new Server().startServer();
        await new Promise(process.nextTick);
        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toEqual('userName and password required')
    })

    // No supported methods
    it('Should do nothing on not handled routes', async () => {
        requestWrapper.url = 'localhost:8080/login';
        requestWrapper.method = HTTP_METHODS.DELETE;

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
    })

})