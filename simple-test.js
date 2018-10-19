const fs = require('fs-extra');
const program = require('commander');

const config = require('./load-config.js');
const insertRecords = require('./insertRecords');

const insertObjects = () => {
    return fs.readJson(config.dataFile)
    .then((result) => {
        return insertRecords(config.tableName, result);
    })
    .then(() => {
        console.log('All records uploaded');
    })
    .catch((err) => {
        console.log('Error occured while uploading records', err);
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