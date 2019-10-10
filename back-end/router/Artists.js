const json = require('../assets/music.json');
const Database = require('../Database');

const getArtists = (req, res) => {
    Database.fetchTable('*', 'ARTISTS', response => {
        res.send(response);
    });
};

const initArtists = () => {
    const TABLE = 'ARTISTS';
    
    Database.dropTable(TABLE);

    Database.createTable(
        TABLE,
        'ID CHAR PRIMARY KEY, FAMILIARITY FLOAT, HOTTNESS FLOAT, LATITUDE FLOAT, LOCATION INT, LONGTITUDE FLOAT, NAME TEXT, SIMILAR FLOAT, TERMS TEXT, FREQ FLOAT'
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
            'ID, FAMILIARITY, HOTTNESS, LATITUDE, LOCATION, LONGTITUDE, NAME, SIMILAR, TERMS, FREQ',
            `"${object.id}", ${object.familiarity}, ${object.hotttnesss}, ${object.latitude}, ${object.location}, ${object.longitude}, "${object.name}", ${object.similar}, "${object.terms}", ${object.terms_freq}`
        );
    });
};

module.exports = {
    getArtists,
    initArtists,
};
