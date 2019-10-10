const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sqlite.db', error => {
    const text = error
        ? 'Error Connecting to DB'
        : 'Connected successfully';

    console.log(text);
});

/**
 * Fetch the entire table;
 * @param {String} selects 
 * @param {String} table 
 * @param {Function} callback 
 * @param {String | Optional} where 
 */
const fetchTable = (selects, table, callback, where = null) => {
    const query = where
        ? `SELECT ${selects} FROM ${table} WHERE ${where}`
        : `SELECT ${selects} FROM ${table}`;
    
    db.serialize(() => {
        db.all(query, (error, rows) => {
            if (!error) {
                callback(rows);
            } else {
                callback(null);
            }
        });
    });
};

/**
 * Create the table with the integrity types;
 * @param {String} table 
 * @param {String} info 
 */
const createTable = (table, info) => {
    db.serialize(() => {
        db.run(`CREATE TABLE ${table} (${info})`);
    });
    
};

/**
 * Insert a row in the table;
 * @param {String} table 
 * @param {String} prep 
 * @param {String} data 
 */
const insertData = (table, prep, data) => {
    db.serialize(() => {
        db.run(
            `INSERT INTO ${table} 
                (${prep}) 
            VALUES 
                (${data})`
        );
    });
    
};

/**
 * Delete a row in the table;
 * @param {String} table 
 * @param {String} data 
 */
const deleteRow = (table, data) => {
    db.serialize(() => {
        db.run(`DELETE FROM ${table} WHERE ${data}`);
    });
}

/**
 * Delete table if present
 * @param {String} table 
 */
const dropTable = table => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${table}`);
    });
};

module.exports = {
    createTable,
    insertData,
    dropTable,
    deleteRow,
    fetchTable,
};
