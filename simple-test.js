const fs = require('fs-extra');
const program = require('commander');
const Promise = require('bluebird');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamodb = new DynamoDB({
    region: 'ap-south-1'
});

const config = require('./load-config.js');

const { getDynamoObject, getJsonObject } = require('./dynamoHelpers/objectWrapper.js');
const createPutRequest = require('./dynamoHelpers/createPutRequest');

const insertObjects = () => {
    return fs.readJson(config.dataFile)
    .then((result) => {
        const records = result.slice(0, 25);
        const params = createPutRequest(config.tableName, records);
        dynamodb.batchWriteItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
    })
    .then(() => {
        console.log('All records uploaded');
    });
}

const getObject = (id) => {
    console.log(`getting data for ${id}`);
    return Promise.resolve();
}

const fetchObjects = () => {
    console.log('getting all objects');
    return Promise.resolve();
}

async function runCommand () {
    if (program.insert) {
        await insertObjects();
    } else if (program.get) {
        await getObject(program.get)
    } else if (program.fetch) {
        await fetchObjects();
    }
}

if (require.main === module) {
    program
        .option('-i, --insert', 'Insert Objects')
        .option('-g, --get <id>', 'Get Object')
        .option('-f, --fetch', 'Fetch Objects')
        .parse(process.argv);
    runCommand();
}