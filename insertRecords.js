const Promise = require('bluebird');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamodb = new DynamoDB({
    region: 'ap-south-1'
});

const config = require('./load-config.js');

const createPutRequest = require('./dynamoHelpers/createPutRequest');

const getRecordBatches = (records) => {
    const recordBatches = records.reduce((acc, record) => {
        const batch = acc.pop();
        if (batch.length < config.insertBatchMaxSize) {
            batch.push(record);
            acc = [...acc, batch];
        } else {
            acc = [...acc, batch, [record]];
        }
        return acc;
    }, [[]]);
    return recordBatches;
}

const insertRecords = (tableName, records) => {
    return (new Promise((resolve, reject) => {
        const params = createPutRequest(tableName, records);
        dynamodb.batchWriteItem(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }));
}

module.exports = (tableName, records) => {
    const recordBatches = getRecordBatches(records);
    return Promise.each(recordBatches, (recordBatch) => {
        return insertRecords(tableName, recordBatch);
    });
};