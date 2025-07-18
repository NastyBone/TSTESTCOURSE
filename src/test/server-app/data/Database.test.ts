import { DataBase } from "../../../app/server_app/data/DataBase"
import * as IdGenerator from '../../../app/server_app/data/IdGenerator'
type ObjectWithId = {
    id: string,
    name: string,
    color: string
}
describe('Testing database', ()=> {

    let sut: DataBase<ObjectWithId>;
    // This allows to mock the returned valued from a function. 
    const someObject1 = {
        id: '',
        name: 'someObject',
        color: 'black',
    }
    const someObject2 = {
        id: '',
        name: 'otherObject',
        color: 'black',
    }
    const fakeId = '1234';
    beforeEach(() =>{
        sut = new DataBase<ObjectWithId>
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(fakeId)
    })

    test('it should retrieve data with the correct id', async () => {
        const actual = await sut.insert({ id: ''} as any);
        expect(actual).toBe(fakeId);
    })

    test('it should get element after insert', async () => {
        const id = await sut.insert(someObject1);
        const actual = await sut.getBy('id', id);
        expect(actual).toBe(someObject1);
    })

    test('it should retrieve all elements with the same property', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);
        const expected = [someObject1, someObject2];
        const actual = await sut.findAllBy('color', 'black');
        expect(actual).toEqual(expected);
    })

    test('it should change object color', async () => {
        const id = await sut.insert(someObject1);
        const expectedColor = 'white'
        await sut.update(id, 'color', expectedColor);
        const element = await sut.getBy('id', id);
        const elementColor = element.color;
        expect(elementColor).toBe(expectedColor);
    })

    test('it should delete the object', async () => {
        const id = await sut.insert(someObject1);
        await sut.delete(id);
        const result = await sut.getBy('id', id);
        expect(result).toBeUndefined();
    })

    test('it should return all elements', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);
        const expected = [someObject1, someObject2];
        const result = await sut.getAllElements()
        expect(result).toEqual(expected);
    })
})