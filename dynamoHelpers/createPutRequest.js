const { getDynamoObject } = require('./objectWrapper');

module.exports = (tableName, jsonObjects) => {
    const request = {
        RequestItems : {
            [tableName]: []
        }
    };
    for (const jsonObject of jsonObjects) {
        const dyanmoObject = getDynamoObject(jsonObject);
        request.RequestItems[tableName].push({
            PutRequest: {
                Item: dyanmoObject
            }
        });
    }
    return request;
}