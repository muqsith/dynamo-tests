const fs = require('fs');

//const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');


const BUCKET_NAME = 'wkdev';

// AWS.config.update({
//     accessKeyId: "AKIAJBJ46PFONLHBGS6A",
//     secretAccessKey: "h3IZmgsWjWreeMUzvIthvLx8De3aZnVV5N0TytAy"
//     //"region": "sa-east-1"   <- If you want send something to your bucket, you need take off this settings, because the S3 are global. 
// });

fs.readFile('/Users/abdulmuqsith/Documents/UNIX_and_Linux_System_Adminstration_Handbook.pdf', 
    (err, buf) => {
        const putParams = {
            Bucket: BUCKET_NAME, 
            Key: 'UNIX_and_Linux_System_Adminstration_Handbook', 
            Body: buf
        };
        if (!err) {
            const s3 = new S3({
                endpoint: 'https://s3.ap-south-1.amazonaws.com'
            });
            
            s3.putObject(putParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    console.log(`Successfully uploaded data to ${BUCKET_NAME}/test123`);
                }
            });
        } else {
            console.log(err);
        }
});

