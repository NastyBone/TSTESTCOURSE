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

    it('Should insert a user', async () => {
        requestWrapper.url = 'localhost:8080/register';
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'userName',
            password: 'password'
        }
        requestWrapper.headers.push(JSON.parse(`{"user-agent": "Windows"}`))
        jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');
        await new Server().startServer(); 
        await new Promise(process.nextTick);
        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({
            userId: expect.any(String)
        }))
    })
})