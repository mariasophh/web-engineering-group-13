const fs = require('fs');
const path = require('path');

const read_file = relativePath => {
    // load file at /relativePath as a string
    return fs.readFileSync(path.join(__dirname, relativePath), {encoding: 'utf8'});
};

module.exports = {
    read_file,
}