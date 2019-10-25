const json = require('../assets/music.json');
const Database = require('../Database');
const Utilities = require('../Utilities');
const TABLE = 'RELEASES';

/**
 * This function fetches all the id's of the releases by an artist 
 * @param {Object} req 
 * @param {Object} res 
 */
const getReleases = (req, res) => {
    const { id } = req.params;
    const { contentType } = req.query;

    Database.fetchTable("ID", TABLE, response => {
        Utilities.responseHandlingGET(res, response, contentType);
    }, `ARTIST_ID = "${id}"`);
};

 /**
 * This function initialises the RELEASES table and
 * populates it with the initial given values
 */
const initReleases = () => {
    const TABLE = 'RELEASES';

    Database.dropTable(TABLE);

    Database.createTable(
        TABLE,
        'ID INT PRIMARY KEY, ARTIST_ID CHAR, NAME INT'
    );
    // Unique entries
    const tree = {};
    // Extract each unique entry
    json.forEach(element => {
        const object = {};

        Object.keys(element).forEach(sub => {
            if (sub.includes('release.')) {
                const key = sub.split('.')[1];
                object[key] = element[sub];
            }
            object['artist_id'] = element['artist.id'];
        });

        tree[object.id] = object;
    });
    // Iterate through our unique entries
    Object.keys(tree).forEach(node => {
        const object = tree[node];

        Database.insertData(
            TABLE,
            'ID, ARTIST_ID, NAME',
            `${object.id}, "${object.artist_id}", ${object.name}`,
            response => {}
        );
    });
};

module.exports={
    initReleases,
    getReleases,
}