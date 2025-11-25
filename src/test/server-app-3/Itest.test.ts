import { Reservation } from "../../app/server_app/model/ReservationModel";
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

    const someReservation: Reservation = {
        id: '',
        startDate: 'someStartDate',
        endDate: 'someEndDate',
        user: 'userName',
        room: 'someRoom'

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

    // Login
    let token: string;
    it('Should login an user with its credentials', async () => {
        const response = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        })
        const responseBody = await response.json();
        expect(response.status).toBe(HTTP_CODES.CREATED);
        expect(responseBody.token).toBeDefined();
        // Save token
        token = responseBody.token;

    })
    // Create reservation
    let reservationId: string;
    it('Should create a reservation if authorized', async () => {
        const response = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })
        const responseBody = await response.json();
        expect(response.status).toBe(HTTP_CODES.CREATED);
        expect(responseBody.reservationId).toBeDefined();
        // Save id
        reservationId = responseBody.reservationId;
    })
    // Get reservation
    it('Should get a reservation if authorized', async () => {
        const response = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })
        const expectedReservation = { ...someReservation, id: reservationId }
        const responseBody: Reservation = await response.json();

        expect(response.status).toBe(HTTP_CODES.OK);
        expect(responseBody).toEqual(expectedReservation);
    })

    // Get all reservations
    it('Should get all reservations if authorized', async () => {


        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })

        const response = await fetch(`http://localhost:8080/reservation/all`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })
        const responseBody: Reservation[] = await response.json();

        expect(response.status).toBe(HTTP_CODES.OK);
        expect(responseBody).toHaveLength(4);
    })

    // Update reservation
    it('Should get a reservation if authorized', async () => {
        await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.PUT,
            headers: {
                authorization: token
            },
            body: JSON.stringify({ room: 'someOtherRoom' })
        })

        const response = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            },
        })
        const responseBody: Reservation = await response.json();
        expect(responseBody.room).toBe('someOtherRoom')
        expect(response.status).toBe(HTTP_CODES.OK);
    })
    // Delete reservation
    it('Should get a reservation if authorized', async () => {
        await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.DELETE,
            headers: {
                authorization: token
            },
        })

        const response = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            },
        })
        expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
    })
})