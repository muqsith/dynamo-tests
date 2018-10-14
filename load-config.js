const cjson = require('cjson');
const fs = require('fs-extra');
const path = require('path');

const configDir = path.resolve(__dirname, 'config');
const localConfigFile = 'local.cjson';

let configFiles = fs.readdirSync(configDir);
const localFileIndex = configFiles.indexOf(localConfigFile);
if (localFileIndex !== -1) {
    configFiles = [...configFiles.slice(0, localFileIndex), 
            ...configFiles.slice(localFileIndex+1, configFiles.length)]
    configFiles = [...configFiles, localConfigFile];
}

configFiles = configFiles.map((configFile) => path.resolve(configDir, configFile));

const conf = cjson.load(configFiles, true)

module.exports = conf;