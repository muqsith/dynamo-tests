// DynamoDB types
const STRING_TYPE = 'S'; // "S": "Hello"
const NUMBER_TYPE = 'N'; // "N": "123.45"
const BUFFER_TYPE = 'B'; // "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
const STRING_SET_TYPE = 'SS'; // "SS": ["Giraffe", "Hippo" ,"Zebra"]
const NUMBER_SET_TYPE = 'NS'; // "NS": ["42.2", "-19", "7.5", "3.14"]
const BUFFER_SET_TYPE = 'BS'; // "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
const MAP_TYPE = 'M'; // "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
const LIST_TYPE = 'L'; // "L": ["Cookies", "Coffee", 3.14159]
const NULL_TYPE = 'NULL'; // "NULL": true
const BOOLEAN_TYPE = 'BOOL'; // "BOOL": true or "BOOL": false

// program constants
const UNKNOWN = 'unknown';
const JS_STRING = 'string';
const JS_NUMBER = 'number';
const JS_BUFFER = 'buffer';

const getArrayType = (value) => {
    let type = LIST_TYPE;
    if (value.length) {
        let elementType = undefined;
        for (let i = 1; i < value.length; i += 1) {
            const currentElement = value[i];
            let currentElementType = undefined;
            if (typeof currentElement === JS_STRING) {
                currentElementType = JS_STRING;
            } else if (typeof currentElement === JS_NUMBER) {
                currentElementType = JS_NUMBER;
            } else if (currentElement instanceof Buffer) {
                currentElementType = JS_BUFFER;
            } else {
                elementType = UNKNOWN;
                break;
            }
            if (typeof elementType == undefined) {
                elementType = currentElementType;
            } else if (elementType !== currentElementType) {
                elementType = UNKNOWN;
            }
        }
        if (elementType === JS_STRING) {
            type = STRING_SET_TYPE;
        } else if (elementType === JS_NUMBER) {
            type = NUMBER_SET_TYPE;
        } else if (elementType === JS_BUFFER) {
            type = BUFFER_SET_TYPE;
        }
    }
    return type;
}

const getComplexType = (value) => {
    let type = undefined;
    if (!value && typeof value === 'object') {
        type = NULL_TYPE;
    } else if (Array.isArray(value)) {
        type = getArrayType(value);
    } else if (value instanceof Buffer) {
        type = BUFFER_TYPE;
    } else if (typeof value === 'object') {
        type = MAP_TYPE;
    }
    return type;
}

const getPrimitiveType = (value) => {
    let type = undefined;
    switch (typeof value) {
        case 'string': {
            type = STRING_TYPE;
            break;
        }
        case 'number': {
            type = NUMBER_TYPE;
            break;
        }
        case 'boolean': {
            type = BOOLEAN_TYPE;
            break;
        }
        case 'number': {
            type = NUMBER_TYPE;
            break;
        }
        case 'undefined': {
            type = NULL_TYPE;
            break;
        }
        default: break;
    }
    return type;
}

const getDynamoType = (dynamoObject) => {
    let type = undefined;
    if (dynamoObject[STRING_TYPE]) {
        type = STRING_TYPE;
    } else if (dynamoObject[NUMBER_TYPE]) {
        type = NUMBER_TYPE;
    } else if (dynamoObject[BUFFER_TYPE]) {
        type = BUFFER_TYPE;
    } else if (dynamoObject[STRING_SET_TYPE]) {
        type = STRING_SET_TYPE;
    } else if (dynamoObject[NUMBER_SET_TYPE]) {
        type = NUMBER_SET_TYPE;
    } else if (dynamoObject[BUFFER_SET_TYPE]) {
        type = BUFFER_SET_TYPE;
    } else if (dynamoObject[MAP_TYPE]) {
        type = MAP_TYPE;
    } else if (dynamoObject[LIST_TYPE]) {
        type = LIST_TYPE;
    } else if (dynamoObject[NULL_TYPE]) {
        type = NULL_TYPE;
    } else if (dynamoObject[BOOLEAN_TYPE]) {
        type = BOOLEAN_TYPE;
    }
    return type;    
}


const getDynamoObject = (jsonObject) => {
    let result = {};
    if (jsonObject && typeof jsonObject === 'object') {
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                const val = jsonObject[key];
                const type = getPrimitiveType(val) || getComplexType(val);
                if (type) {
                    if (type === MAP_TYPE) {
                        result[key] = {
                            [type]: getDynamoObject(val)
                        };
                    } else if (type === NUMBER_TYPE) {
                        result[key] = {
                            [type]: JSON.stringify(val)
                        };
                    } else if (type === NUMBER_SET_TYPE) {
                        result[key] = {
                            [type]: val.map((e) => JSON.stringify(e))
                        };
                    } else {
                        result[key] = {
                            [type]: val
                        }
                    }                    
                }
            }
        }
    }
    return result;
}

const getJsonFromMapType = (mapObject) => {
    const result = {};
    if (mapObject && typeof mapObject === 'object') {
        for (const key in mapObject) {
            result[key] = getValueFromDynamoObject(mapObject, key);
        }
    }
    return result;
}

const getValueFromDynamoObject = (dynamoObject, key) => {
    let result = undefined;
    const value = dynamoObject[key];
    const type = getDynamoType(value);
    if (type === MAP_TYPE) {
        result = getJsonFromMapType(value[type]);
    } else if (type === NUMBER_TYPE) {
        result = +value[type];
    } else if (type === NUMBER_SET_TYPE) {
        result = value[type].map((e) => +e);
    } else {
        result = value[type];
    }
    return result;
}

const getJsonObject = (dynamoObject) => {
    let result = {};
    if (dynamoObject && typeof dynamoObject === 'object') {
        for (const key in dynamoObject) {
            if (dynamoObject.hasOwnProperty(key)) {
                result[key] = getValueFromDynamoObject(dynamoObject, key);
            }
        }
    }
    return result;
}

module.exports = {
    getDynamoObject,
    getJsonObject
};