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

// getby
const spyOnGetBy = jest.spyOn(DataBase.prototype, 'getBy')
// insert
const spyOnInsert = jest.spyOn(DataBase.prototype, 'insert')
// update
const spyOnUpdate = jest.spyOn(DataBase.prototype, 'update');
// delete
const spyOnDelete = jest.spyOn(DataBase.prototype, 'delete');
// getAllElements 
const spyOnGetAllElements = jest.spyOn(DataBase.prototype, 'getAllElements');



const someReservation = {
    id: '',
    room: '01',
    user: 'someUser',
    startDate: '2025-01-01',
    endDate: '2025-01-01',
}
const someOtherReservation = {
    id: '',
    room: '02',
    user: 'someOtherUser',
    startDate: '2025-01-02',
    endDate: '2025-01-02',
}
const someId = 'someId';
const someToken = 'someToken'
const jsonHeader = { 'Content-Type': 'application/json' }

describe('Test suite for reservation request', () => {

    beforeEach(() => {
        requestWrapper.url = 'localhost:8080/reservation';
        requestWrapper.headers['user-agent'] = 'SomeAgent';
        requestWrapper.headers['authorization'] = 'SomeAuth';
        spyOnGetBy.mockResolvedValueOnce({ valid: true });

    })

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.resetAllMocks();
    })

    // POST
    describe('POST REQUESTS', () => {
        beforeEach(() => {
            requestWrapper.method = HTTP_METHODS.POST;
        })


        // Valid reservation
        it('Should validate reservation on regular case', async () => {
            requestWrapper.body = someReservation;
            spyOnGetBy.mockResolvedValueOnce(someToken);
            spyOnInsert.mockResolvedValueOnce(someId);

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseWrapper.body).toEqual({ reservationId: someId });
            expect(responseWrapper.headers).toContainEqual(jsonHeader)

        })
        // Invalid reservation
        it('Should throw error on invalid data', async () => {

            requestWrapper.body = {};
            spyOnGetBy.mockResolvedValueOnce(someToken);
            spyOnInsert.mockResolvedValueOnce(someId);

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Incomplete reservation!');

        })
    })
    // GET
    describe('GET REQUESTS', () => {
        beforeEach(() => {
            requestWrapper.method = HTTP_METHODS.GET;
        })
        // ALL
        it('Should return all data', async () => {
            requestWrapper.url += '/all';
            spyOnGetAllElements.mockResolvedValueOnce([someReservation, someOtherReservation]);


            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual([someReservation, someOtherReservation])
            expect(responseWrapper.headers).toContainEqual(jsonHeader)


        })

        // ID
        describe('Retrieving specific data', () => {
            // Found
            it('Should return valid data providing valid id', async () => {
                requestWrapper.url += `/${someId}`;
                spyOnGetBy.mockResolvedValueOnce(someReservation);


                await new Server().startServer();
                await new Promise(process.nextTick);

                expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
                expect(responseWrapper.body).toEqual(someReservation)
                expect(responseWrapper.headers).toContainEqual(jsonHeader)

            })


            // Not found
            it('Should return not found error when id provided does not exist', async () => {
                requestWrapper.url += `/${someId}`;


                await new Server().startServer();
                await new Promise(process.nextTick);

                expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
                expect(responseWrapper.body).toEqual(`Reservation with id ${someId} not found`)
            })
        })
        // Invalid request: something not 'all' or an id
        it('Should throw error on invalid parameters', async () => {

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!')
        })

    })
    // PUT
    describe('PUT REQUESTS', () => {
        beforeEach(() => {
            requestWrapper.method = HTTP_METHODS.PUT;
        })
        // Valid
        it('Should update fields with right data provided', async () => {
            requestWrapper.url += `/${someId}`;
            requestWrapper.body = {
                room: '03'
            }
            spyOnGetBy.mockResolvedValueOnce(someReservation);

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual(`Updated ${Object.keys(requestWrapper.body)} of reservation ${someId}`);
            expect(responseWrapper.headers).toContainEqual(jsonHeader);
        })

        // No fields provided
        it('Should return error in missing fields', async () => {
            requestWrapper.url += `/${someId}`;
            requestWrapper.body = {}
            spyOnGetBy.mockResolvedValueOnce(someReservation);

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide valid fields to update!');
        })

        // Not found id
        it('Should return not found error when provided id does not exist', async () => {
            requestWrapper.url += `/${someId}`;
            requestWrapper.body = {
                room: '03'
            }

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseWrapper.body).toEqual(`Reservation with id ${someId} not found`);
        })

        // No id provided
        it('Should return error of id missing', async () => {
            requestWrapper.body = {
                room: '03'
            }

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!');
        })

    })
    // DELETE
    describe('DELETE REQUESTS', () => {

        beforeEach(() => {
            requestWrapper.method = HTTP_METHODS.DELETE;
        })
        // Valid
        it('Should validate remove data', async () => {
            requestWrapper.url += `/${someId}`;

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual(`Deleted reservation with id ${someId}`);
        })

        // No id provided
        it('Should return error in missing id', async () => {

            await new Server().startServer();
            await new Promise(process.nextTick);

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!');
        })
    })

    it('Should do nothing on not supported methods', async () => {
        requestWrapper.method = HTTP_METHODS.OPTIONS;

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
    })
    it('Should return unauthorized on not authorized headers', async () => {
        requestWrapper.headers['authorization'] = null;
        requestWrapper.method = HTTP_METHODS.GET
        requestWrapper.url += '/all';

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseWrapper.body).toEqual('Unauthorized operation!');

    })

})