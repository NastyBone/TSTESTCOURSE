import { getRequestBody } from "../../../app/server_app/utils/Utils"
import { IncomingMessage } from 'http'

describe('Test suite for Utils.ts', () => {

    const requestMock = {
        on: jest.fn()
    }

    const someObject = {
        name: 'pepe',
        age: 12,
        genter: 0.0445832232
    }
    const someDataToString = JSON.stringify(someObject)
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('Should success passing correct data', async () => {
        requestMock.on.mockImplementation((event, callback) => {
            if (event === 'data') {
                callback(someDataToString)
            } else {
                callback()
            }
        })
        const result = await getRequestBody(requestMock as any as IncomingMessage)

        expect(result).toEqual(someObject);

    })

    it('Should throw error passing incorrect JSON format', async () => {
        requestMock.on.mockImplementation((event, callback) => {
            if (event === 'data') {
                callback('z' + someDataToString)
            } else {
                callback()
            }
        })

        await expect(getRequestBody(requestMock as any as IncomingMessage)).rejects.toThrow('Unexpected token z in JSON at position 0')

    })
    it('Should throw error on unexpected errors', async () => {
        const someError = new Error('Something went wrong');
        requestMock.on.mockImplementation((event, callback) => {
            if (event === 'error') {
                callback(someError)
            }
        })

        await expect(getRequestBody(requestMock as any as IncomingMessage)).rejects.toThrow(someError.message)
    })
})