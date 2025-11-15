import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler"
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler"
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler"
import { Server } from "../../../app/server_app/server/Server"
import { HTTP_CODES } from '../../../app/server_app/model/ServerModel';


jest.mock("../../../app/server_app/data/ReservationsDataAccess")
jest.mock("../../../app/server_app/handlers/LoginHandler")
jest.mock("../../../app/server_app/handlers/RegisterHandler")
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

    it('Should handle register requests', async () => {
        requestMock.url = 'localhost:8080/register';
        const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest')

        await sut.startServer()

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(RegisterHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer))
    })
    it('Should handle login requests', async () => {
        requestMock.url = 'localhost:8080/login';
        const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest')

        await sut.startServer()

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(LoginHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer))
    })

    it('Should handle reservation requests', async () => {
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest')

        await sut.startServer()

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(ReservationsHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer), expect.any(ReservationsDataAccess))
    })
    it('Should do nothing on calling unhandled cases', async () => {
        requestMock.url = 'localhost:8080/somePath';
        const validateTokenSpy = jest.spyOn(Authorizer.prototype, 'validateToken')

        await sut.startServer()

        expect(validateTokenSpy).not.toHaveBeenCalled()
    })

    it('Should handle errors', async () => {
        requestMock.url = 'localhost:8080/reservation';
        const errorMessage = 'some error';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest')
        handleRequestSpy.mockRejectedValueOnce(new Error(errorMessage));
        await sut.startServer()
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.INTERNAL_SERVER_ERROR, JSON.stringify(`Internal server error: ${errorMessage}`))
    })

    it('Should close server', async () => {
        await sut.startServer();
        await sut.stopServer();
        expect(serverMock.close).toHaveBeenCalledTimes(1)
    })

})