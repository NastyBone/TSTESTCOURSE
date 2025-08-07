import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { Server } from "../../../app/server_app/server/Server"

jest.mock("../../../app/server_app/data/ReservationsDataAccess")
jest.mock("../../../app/server_app/handlers/LoginHandler")
jest.mock("../../../app/server_app/handlers/ReservationsHandler")
jest.mock("../../../app/server_app/auth/Authorizer")
const requestMock = {
    url: '',
    headers: {
        'user-agent': 'jest-test'
    }

}
const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn(),

}

const serverMock = {
    listen: jest.fn(),
    close: jest.fn()
}


jest.mock('http', () => ({
    createServer: (cb: Function) => {
         cb(requestMock, responseMock)
         return serverMock
    }
}))
describe('test suite for Server Class', () => {

    let sut: Server;

    beforeEach(() => {
        sut = new Server()
        expect(Authorizer).toHaveBeenCalledTimes(1)
        expect(ReservationsDataAccess).toHaveBeenCalledTimes(1)
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should start working', async () => {
        await sut.startServer()

        expect(serverMock.listen).toHaveBeenCalledWith(8080)
        expect(responseMock.end).toHaveBeenCalledTimes(1)
    })
})