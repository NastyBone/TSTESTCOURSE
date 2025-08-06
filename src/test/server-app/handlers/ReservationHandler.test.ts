import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler"
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn()

jest.mock("../../../app/server_app/utils/Utils", () => ({
    getRequestBody: () => getRequestBodyMock()
}))


describe('Test suite for ReservationHandler class', () => {
    let sut: ReservationsHandler;

    const requestMock = {
        method: undefined,
        url: undefined,
        headers: {
            authorization: undefined
        }
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    }
    const authorizerMock = {
        registerUser: jest.fn(),
        validateToken: jest.fn(),
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn(),
    }

    const someReservationId: number = 0;
    const someReservation: Reservation = {
        id: "",
        room: "01",
        user: "someUser",
        startDate: "2025-01-01",
        endDate: "2025-12-31"
    }
    const somePartialReservation: Partial<Reservation> = {
        room: "02",
    }

    afterEach(() => {
        jest.clearAllMocks();
    })
    beforeEach(() => {
        sut = new ReservationsHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any,
            reservationsDataAccessMock as any)
    })

    describe('Handle POST method', () => {
        it('Should register a reservation sucessfully', async () => {
            requestMock.method = HTTP_METHODS.POST;
            requestMock.headers.authorization = 'someToken123'
            authorizerMock.validateToken.mockResolvedValueOnce(true)
            getRequestBodyMock.mockResolvedValueOnce(someReservation);
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationId)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({
                reservationId: someReservationId,
            }))
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
        })

        it('Should throw an error when no data provided ', async () => {
            requestMock.method = HTTP_METHODS.POST;
            requestMock.headers.authorization = 'someToken123'
            authorizerMock.validateToken.mockResolvedValueOnce(true)
            getRequestBodyMock.mockResolvedValueOnce({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify("Incomplete reservation!"))
        })

    })
    describe('Handle GET method', () => {
        it('Should return all data sucessfully', async () => {
            requestMock.method = HTTP_METHODS.GET;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = 'some/url/all'
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([someReservation])

            await sut.handleRequest()

            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify([someReservation]))
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' })
        })

        it('Should return the right data by provided id sucessfully', async () => {
            requestMock.method = HTTP_METHODS.GET;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url/${someReservationId}`
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)

            await sut.handleRequest()
            expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(someReservationId.toString())
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(someReservation))
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' })
        })

        it('Should throw NOT FOUND error with non-existing id passed', async () => {
            requestMock.method = HTTP_METHODS.GET;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url/${someReservationId}`
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(null)

            await sut.handleRequest()
            expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(someReservationId.toString())

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`))
        })

        it('Should throwerror when no id provided', async () => {
            requestMock.method = HTTP_METHODS.GET;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url`
            authorizerMock.validateToken.mockResolvedValueOnce(true)


            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'))
        })
    })
    describe('Handle PUT method', () => {
        it('Should update the right data by provided id sucessfully', async () => {
            requestMock.method = HTTP_METHODS.PUT;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url/${someReservationId}`
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)
            getRequestBodyMock.mockResolvedValueOnce(somePartialReservation);


            await sut.handleRequest()

            expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(someReservationId.toString())

            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Updated ${Object.keys(somePartialReservation)} of reservation ${someReservationId.toString()}`))
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' })
        })

        it('Should throw NOT FOUND error with non-existing id passed', async () => {
            requestMock.method = HTTP_METHODS.PUT;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url/${someReservationId}`
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(null)

            await sut.handleRequest()
            expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(someReservationId.toString())

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`))
        })

        it('Should throw error when no id provided', async () => {
            requestMock.method = HTTP_METHODS.PUT;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url`
            authorizerMock.validateToken.mockResolvedValueOnce(true)


            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'))
        })
    })
    describe('Handle DELETE method', () => {

        it('Should delete an entry sucessfully', async () => {
            requestMock.method = HTTP_METHODS.DELETE;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url/${someReservationId}`
            authorizerMock.validateToken.mockResolvedValueOnce(true)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.OK)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${someReservationId}`))
        })

        it('Should throw error when no id provided', async () => {
            requestMock.method = HTTP_METHODS.DELETE;
            requestMock.headers.authorization = 'someToken123'
            requestMock.url = `some/url`
            authorizerMock.validateToken.mockResolvedValueOnce(true)


            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'))
        })
    })

    it('Should return unauthorized when headers are not valids', async () => {
        requestMock.headers.authorization = ''
        requestMock.method = HTTP_METHODS.OPTIONS;

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'))


    })

    it('Should do nothing when invalid HTTP method passed', async () => {
        requestMock.headers.authorization = 'someToken123'
        authorizerMock.validateToken.mockResolvedValueOnce(true)
        await sut.handleRequest();

        expect(responseMock.write).not.toHaveBeenCalled()
        expect(responseMock.writeHead).not.toHaveBeenCalled()
    })
})