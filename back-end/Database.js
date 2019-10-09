const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sqlite.db', error => {
    const text = error
        ? 'Error Connecting to DB'
        : 'Connected successfully';

    console.log(text);
});

/**
 * Fetch the entire table;
 * 
 * @param {String} location the location of the database;
 * @param {Function} callback the function;
 */
const fetchTable = (location = 'ARTISTS', callback) => {
    db.all(`SELECT * FROM ${location}`, (error, rows) => {
        if (!error) {
            callback(rows);
        }
    });
};

/**
 * Create the table with the integrity types
 */
const createTable = (name, info) => {
    db.run(`CREATE TABLE ${name} (${info})`);
};

/**
 * Insert a row in the table
 */
const insertData = (name, prep, data) => {
    db.run(
        `INSERT INTO ${name} 
            (${prep}) 
        VALUES 
            (${data})`
    );
};

const dropTable = name => {
    db.run(`DROP TABLE ${name}`);
};

module.exports = {
    createTable,
    insertData,
    dropTable,
    fetchTable,
};
