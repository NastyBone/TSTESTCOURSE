import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server"
import { makeAwesomeRequest } from "./utils/http-client";

describe('Integration tests for server', () => {
    
    let server: Server;

    const someUser = {
        id: '',
        userName: 'userName',
        password: 'passWord',
    }
    
    beforeAll(() => {
        server = new Server();
        server.startServer();
    })
    afterAll(() => {
        server.stopServer();
    })

    it('Should register an user', async () => {
        const response = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        })
        const responseBody = await response.json();
        //
        expect(response.status).toBe(HTTP_CODES.CREATED);
        expect(responseBody.userId).toBeDefined();
    })

        it('Should register an user with awesomeRequest', async () => {
        const response = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register',
        }, someUser);
        //
        expect(response.statusCode).toBe(HTTP_CODES.CREATED);
        expect(response.body.userId).toBeDefined();
    })
})