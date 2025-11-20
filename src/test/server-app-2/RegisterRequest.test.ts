import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./utils/RequestTestWrapper"
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

describe('Test suite for register requests', () => {

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
    })

    beforeEach(() => {
        requestWrapper.headers["user-agent"] = "Windows" 
    })

    it('Should insert a user', async () => {
        requestWrapper.url = 'localhost:8080/register';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'userName',
            password: 'password'
        }
        jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');
        await new Server().startServer();
        await new Promise(process.nextTick);
        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({
            userId: expect.any(String)
        }))
    })

    it('Should reject request on invalid or missing userName and password', async () => {
        requestWrapper.url = 'localhost:8080/register';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
        }
        await new Server().startServer();
        await new Promise(process.nextTick);
         expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toEqual('userName and password required')
    })

        it('Should do nothing on not handled routes', async () => {
        requestWrapper.url = 'localhost:8080/register';
        requestWrapper.method = HTTP_METHODS.DELETE;
        await new Server().startServer();
        await new Promise(process.nextTick);

         expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
    })
})