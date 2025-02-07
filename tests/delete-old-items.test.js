const mockingoose = require('mockingoose');
const itemModel = require('../src/models/items.models');


describe('Test mongoose deleteMany on items model', () => {
    it('Should return the deletedCount of 1', () => {
        const document = {
                "deletedCount": 1
        };

        mockingoose(itemModel).toReturn(document, 'deleteMany');

        return itemModel.deleteMany({"active": false, "age": {"$lte": new Date()}}).then(doc => {
            expect(doc.deletedCount).toBe(1);
        });
    });
});