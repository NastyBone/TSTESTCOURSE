import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { DataBase } from "../../../app/server_app/data/DataBase";
import { Account } from "../../../app/server_app/model/AuthModel";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
const insertMock = jest.fn();
const getByMock = jest.fn();
const getAllMock = jest.fn();
const deleteMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
                getAllElements: getAllMock,
                update: updateMock,
                delete: deleteMock,
            }
        })
    }
})

describe('Test suite for reservation data access', () => {
    let sut: ReservationsDataAccess;
    const someDate = (new Date()).toString()
    const someOtherDate = (new Date(Date.now() + 60 * 60 * 1000)).toString()
    const someAccount: Account = {
        id: '',
        userName: 'userName',
        password: 'password'
    }
    const someOtherAccount: Account = {
        id: '',
        userName: 'otherName',
        password: 'otherPassword'
    }
    const someReservation: Reservation = {
        id: '',
        room: '01',
        user: someAccount.userName,
        startDate: someDate,
        endDate: someOtherDate,
    };
        const someOtherReservation: Reservation = {
        id: '',
        room: '02',
        user: someOtherAccount.userName,
        startDate: someDate,
        endDate: someOtherDate,
    };
    const someId = '1234';
    beforeEach(() => {
        sut = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1)
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('it should create a reservation', async () => {
        insertMock.mockResolvedValueOnce(someId);
        const actual = await sut.createReservation(someReservation);
        expect(actual).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(someReservation);
    })
    test('it should update a reservation', async () => {
        updateMock.mockResolvedValueOnce(undefined);
        const someField = 'room';
        const someValue = '03'
        const actual = await sut.updateReservation(someId, someField, someValue);
        expect(actual).toBeUndefined();
        expect(updateMock).toHaveBeenCalledWith(someId, someField, someValue)
    })
    test('it should delete a reservation', async () => { 
        deleteMock.mockResolvedValueOnce(undefined);
        const actual = await sut.deleteReservation(someId);
        expect(actual).toBeUndefined();
        expect(deleteMock).toHaveBeenCalledWith(someId);
    })
    test('it should get a single reservation', async () => {
        getByMock.mockResolvedValueOnce(someReservation);
        const actual = await sut.getReservation(someId);
        expect(actual).toEqual(someReservation);
        expect(getByMock).toHaveBeenCalledWith('id', someId);
     })
    test('it should get all reservations', async () => {
        const allReservations = [someReservation, someOtherReservation]
        getAllMock.mockResolvedValueOnce(allReservations);
        const actual = await sut.getAllReservations();
        expect(actual).toEqual(allReservations);
        expect(getAllMock).toHaveBeenCalledWith();
    })
})