import { generateRandomId } from "../../../app/server_app/data/IdGenerator"

describe('Test suite for ID generator', () => {
    it('Should generate a random string', async () => {
        const result = generateRandomId()
        expect(result).toBeTruthy()
        expect(result.length).toEqual(20);
    })
})