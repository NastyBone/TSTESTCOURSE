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

describe('Test suite for Login Requests', () => {
    beforeEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.resetAllMocks();
    })

})