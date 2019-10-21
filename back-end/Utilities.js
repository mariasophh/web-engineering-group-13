const fs = require('fs');
const path = require('path');

/**
 * This function returns the content of a file in a string format given the relative path;
 * @param {String} relativePath 
 */
const read_file = relativePath => {
    // load file at /relativePath as a string
    return fs.readFileSync(path.join(__dirname, relativePath), {encoding: 'utf8'});
};

/**
 * This function converts an object array (JSON) to CSV;
 * It is used whenever the query parameters specify csv representation of the resource;
 * @param {Array} objArray : JSON object array
 */
const toCSV = objArray => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';

        return str;
    }, str);
};

/**
 * This function will be called whenever the request's route does not match any API route;
 * The returned response will has status code 404 and "Resource not found" message;
 * @param {Object} req 
 * @param {Object} res 
 */
const nonExistingRoute = (req, res) => {
    res.status(404).send("Resource not found!");
};

/**
 * This function will handle the responses and their status given the callback value
 * for GET requests
 * @param {Object} status : status attributes;
 * @param {Object} response : passed value from the callback;
 * @param {String | Optional} contentType 
 */
const responseHandlingGET = (status, response, contentType = null) => {
    switch(response) {
        case null:
            status.status(404).send("Resource not available");
            break;
        case "error":
            status.status(400).send("Bad request");
            break;
        default:
            status.status(200).send((contentType && contentType === 'csv')
                ? toCSV(response)
                : response
        );
    }
};

/**
 * This function will handle the responses and their status given the callback value
 * for POST/PUT/DELETE requests
 * @param {Object} status : status attributes;
 * @param {Object} response : passed value from the callback ("error" for any database error, [] for success)
 */
const responseHandlingCUD = (status, response) => {
    switch(response) {
        case "error":
            status.status(400).send("Bad request");
            break;
        default:
            status.status(200).send("Successful");
    }
};

module.exports = {
    read_file,
    nonExistingRoute,
    responseHandlingGET,
    responseHandlingCUD,
}