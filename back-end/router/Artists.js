const json = require('../assets/music.json');
const Database = require('../Database');

const getArtists = (req, res) => {
    Database.fetchTable('ARTISTS', response => {
        res.send(response);
    });
};

const addArtist = (req, res) => {
    Database.createTable(
        'ARTISTS',
        'ID CHAR NOT NULL, FAMILIARITY FLOAT, HOTTNESS FLOAT, LATITUDE FLOAT, LOCATION INT, LONGTITUDE FLOAT, NAME CHAR, SIMILAR FLOAT, TERMS CHAR, FREQ FLOAT'
    );

    json.forEach(element => {
        const object = {};

        Object.keys(element).forEach(sub => {
            if (sub.includes('artist.')) {
                const key = sub.split('.')[1];
                object[key] = element[sub];
            }
        });

        insertData(
            'ARTISTS',
            'ID, FAMILIARITY, HOTTNESS, LATITUDE, LOCATION, LONGTITUDE, NAME, SIMILAR, TERMS, FREQ',
            `"${object.id}", ${object.familiarity}, ${object.hotttnesss}, ${object.latitude}, ${object.location}, ${object.longitude}, "${object.name}", ${object.similar}, "${object.terms}", ${object.terms_freq}`
        );
    });

    res.send('Done');
};

module.exports = {
    getArtists,
    addArtist,
};
