const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sqlite.db', error => {
    const text = error
        ? 'Error Connecting to DB'
        : 'Connected successfully';

    console.log(text);
});

const _query = async (query, callback) => {
    const serialize = new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(query, (error, rows) => {
                if (!error) {
                    resolve(rows);
                } else {
                    reject(error);
                }
            });
        });
    });

    await serialize.then(response => {
        callback(response);
    }).catch(error => {
        console.log('Internal Error -- ', error);
    });
}

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
    
    _query(query, callback);
};

/**
 * Update a table
 * @param {String} table 
 * @param {String} set 
 * @param {Function} callback 
 * @param {String} where 
 */
const updateTable = (table, set, callback, where = null) => {
    const query = where
        ? `UPDATE ${table} SET ${set} WHERE ${where}`
        : `UPDATE ${TABLE} SET ${set}`;

    _query(query, callback);
} 

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

/**
 * This function will fetch all the songs by an artist
 * @param {String} artistID 
 * @param {Function} callback 
 */
const joinTables = (artistID, callback) => {
    fetchTable('ID', 'RELEASES', response => {
        let songs = '';
        response.forEach((element, i) => {
            const { ID } = element;
            const comma = response.length === i + 1
                ? ''
                : ', ';
            songs += ID + comma;
        });
       
        fetchTable('*', 'SONGS', mergedSongs => {
            callback(mergedSongs);
        }, `RELEASE_ID IN (${songs})`);
    }, `ARTIST_ID = "${artistID}"`);
}

/**
 * This function will fetch all the songs by artists 
 * in a specific genre (filtered by terms)
 * @param {String} terms 
 * @param {Function} callback 
 */
const filterByTerms = (terms, callback) => {
    fetchTable('ID', 'ARTISTS', response => {
        let songs = [];
        const length = response.length;

        for (let i = 0; i < length; i++) {
            const { ID } = response[i];
            
            joinTables(ID, res => {
                songs = songs.concat(res);
                
                if (i + 1 === length) callback(songs);
            });
        }
    }, `TERMS = "${terms}"`);
}

module.exports = {
    updateTable,
    createTable,
    insertData,
    dropTable,
    deleteRow,
    fetchTable,
    joinTables,
    filterByTerms,
};
