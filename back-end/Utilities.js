const fs = require('fs');
const path = require('path');

/**
 * This function returns the content of a file in a string format;
 * @param {String} relativePath 
 */
const read_file = relativePath => {
    // load file at /relativePath as a string
    return fs.readFileSync(path.join(__dirname, relativePath), {encoding: 'utf8'});
};

/**
 * This function converts an object array to CSV;
 * @param {Array} objArray 
 */
const toCSV = objArray => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';

        return str;
    }, str);
}

module.exports = {
    read_file,
    toCSV,
}