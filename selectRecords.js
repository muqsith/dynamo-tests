const DynamoDBStreams = require('aws-sdk/clients/dynamodbstreams');
const dynamoDBStreams = new DynamoDBStreams({
    region: 'ap-south-1'
});
const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamodb = new DynamoDB({
    region: 'ap-south-1'
});

const { getJsonObject } = require('./dynamoHelpers/objectWrapper');

const getStreams = () => {
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html
    // DynamoDB streams are for different purpose, read above link

    dynamoDBStreams.listStreams({}, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
}

const getAllTableRecords = () => {
    dynamodb.scan({
        TableName: 'people'
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data && Array.isArray(data.Items)) {
                for (const item of data.Items) {
                    console.log(getJsonObject(item));
                }
            }
        }
    });
}

const selectRecordByKey = (key) => {
    dynamodb.query({
        ExpressionAttributeValues: {
        ":v1": {
            N: key
            }
        }, 
        KeyConditionExpression: "id = :v1", 
        TableName: "people"
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data && Array.isArray(data.Items)) {
                for (const item of data.Items) {
                    console.log(getJsonObject(item));
                }
            }
        }
    });
}

const getRecordsByGender = (gender) => {
    dynamodb.scan({
        TableName: 'people',
        ExpressionAttributeValues: {
            ":a": {
              S: gender
             }
           }, 
        FilterExpression: "gender = :a"
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data && Array.isArray(data.Items)) {
                console.log(data.Items.length);
                // for (const item of data.Items) {
                //     console.log(getJsonObject(item));
                // }
            }
        }
    });
}

//selectRecordByKey('3');

//getAllTableRecords();

getRecordsByGender('Female');