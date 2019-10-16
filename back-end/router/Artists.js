const json = require('../assets/music.json');
const Database = require('../Database');
const Utilities = require('../Utilities');
const TABLE = 'ARTISTS';

/**
 * This function queries the artists table
 * @param {Array} req 
 * @param {Array} res 
 */
const getArtists = (req, res) => {
    const { contentType, rankBy, order, offset, limit } = req.query;
    let where = '';
    let orderBy = '';

    // remove contentType property for database filtering
    if(contentType) delete req.query.contentType;
    
    if (!rankBy) {

        console.log("No rank by");

        // parse possible query parameters for filtering 
        Object.keys(req.query).forEach((key, i) => {
            if (i > 0) where += " AND ";

            where += `${key.toUpperCase()} = "${req.query[key]}"`;
        });
    } else {

        console.log("rank by");

        // query parameters for ordering the data and limiting the data with an offset
        orderBy = ` ORDER BY ${rankBy.toUpperCase()} ${order ? order.toUpperCase() : 'DESC'}`;
        if (limit && limit != 'end') {
            orderBy += ` LIMIT ${limit}`;
        }
        if (offset && offset !== 'start' && limit && limit != 'end') {
            orderBy += ` OFFSET ${offset}`;
        }
    }

    console.log(`Artists: ${orderBy}`);
    
    Database.fetchTable('*', TABLE + orderBy, response => {
        res.status(200).send((contentType && contentType === 'csv')
            ? Utilities.toCSV(response)
            : response
        );
    }, where === '' ? null : where);
};

/**
 * This function returns descriptive statistics of the songs of an artist
 * @param {Array} req 
 * @param {Array} res 
 */
const getStatistics = (req, res) => {
    const { id } = req.params;
    const { year, contentType } = req.query;

    Database.returnStatistics(id, response => {
        res.status(200).send((contentType && contentType === 'csv')
            ? Utilities.toCSV(response)
            : response
        );
    }, year);
};

/**
 * This function initialises the ARTISTS table and
 * populates it with the initial given values
 */
const initArtists = () => {
    Database.dropTable(TABLE);

    Database.createTable(
        TABLE,
        'ID CHAR PRIMARY KEY, FAMILIARITY FLOAT, HOTTTNESSS FLOAT, LATITUDE FLOAT, LOCATION INT, LONGTITUDE FLOAT, NAME TEXT, SIMILAR FLOAT, TERMS TEXT, FREQ FLOAT'
    );

    const tree = {};

    json.forEach(element => {
        const object = {};

        // Parse the artist related data from the dataset
        Object.keys(element).forEach(sub => {
            if (sub.includes('artist.')) {
                const key = sub.split('.')[1];
                object[key] = element[sub];
            }
        });
        // Insert into tree w/ uniqueness
        tree[object.id] = object;
    });
 
    // Insert unique entries in the DB
    Object.keys(tree).forEach(node => {
        const object = tree[node];

        Database.insertData(
            TABLE,
            'ID, FAMILIARITY, HOTTTNESSS, LATITUDE, LOCATION, LONGTITUDE, NAME, SIMILAR, TERMS, FREQ',
            `"${object.id}", ${object.familiarity}, ${object.hotttnesss}, ${object.latitude}, ${object.location}, ${object.longitude}, "${object.name}", ${object.similar}, "${object.terms}", ${object.terms_freq}`
        );
    });
};

module.exports = {
    getArtists,
    initArtists,
    getStatistics,
};
