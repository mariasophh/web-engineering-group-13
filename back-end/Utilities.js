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
    let processedData = [], processedLinks = [];
    // separate the data and links in the json to parse them differently
    Object.keys(objArray).forEach(item => {
        processedData.push(objArray[item].data);
        processedLinks.push(objArray[item].links);
    });
    // data headers
    const headerData = Object.keys(processedData[0]);
    const replacer = (key, value) => value === null ? '' : value;
    let csv = [];
    Object.keys(processedData).forEach(index => {
        // parse information on current data row (object)
        let rowData = processedData[index];
        csv.push(headerData.map(fieldName => JSON.stringify(rowData[fieldName], replacer)).join(','));
        csv.push(',');
        // parse information on current links row, note that the links row is an array of objects
        // thus it is treated differently than the data row
        let rowLink = processedLinks[index];
        if(rowLink.length) {
            Object.keys(rowLink).forEach(item => {
                let current = rowLink[item];
                csv.push(Object.keys(current).map(fieldName => JSON.stringify(current[fieldName], replacer)).join(','));
                csv.push(',');
            });
        } else {
            // only one link, parse it once 
            csv.push(JSON.stringify(rowLink.rel ? rowLink.rel : ""), ",", JSON.stringify(rowLink.href ? rowLink.href : ""));
        }
     });
    // modify headers in manner data/key or links/key
    const newHeaderData = headerData.map(item => {return "data/" + item});
    const newHeaderLinks = (processedLinks[0])[0]
        ? Object.keys((processedLinks[0])[0]).map(item => {return "links/" + item})
        : Object.keys(processedLinks[0]).map(item => {return "links/" + item})
    // add headers
    csv.unshift(',');
    csv.unshift(newHeaderLinks.join(','));
    csv.unshift(',');
    csv.unshift(newHeaderData.join(','));
    csv = csv.join('\r\n');
    
    return csv;
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
 * @param {Array | Optional} refs
 */
const responseHandlingGET = (status, response, contentType = null, refs=null) => {
    //  construct the final response from data from the database + links 

    switch(response) {
        case null:
            status.status(404).send("Resource not available");
            break;
        case "error":
            status.status(400).send("Bad request");
            break;
        default:
            let finalResponse = [];
            Object.keys(response).forEach(key => {
                finalResponse.push({
                    data : response[key],
                    links : refs
                            ? refs[key]
                            : {
                                "rel" : "",
                                "href" : ""
                            }
                });
            });

            status.status(200).send((contentType && contentType === 'csv')
                ? toCSV(finalResponse)
                : finalResponse
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