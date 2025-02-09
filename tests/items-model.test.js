const mockingoose = require('mockingoose');
const itemModel = require('../src/models/items.models');

describe('Test mongoose items model', () => {
    it('Should return the document with findById', () => {
        const document = {
                "_id": "507f191e810c19729de860ea",
                "name": "test",
                "amount": 1,
                "price": 0,
                "total": 0,
                "active": false,
                "age": "2025-02-05T18:18:39.704Z"
        };

        mockingoose(itemModel).toReturn(document, 'findOne');

        return itemModel.findById({_id: "507f191e810c19729de860ea"}).then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(document);
        });
    });
});