const json = require('../assets/music.json');
const Database = require('../Database');

const initReleases = () => {
    const TABLE = 'RELEASES';

    Database.dropTable(TABLE);

    Database.createTable(
        TABLE,
        'ID INT PRIMARY KEY, ARTIST_ID CHAR, NAME INT'
    );
    // Unique entries
    const tree = {};
    // Extrack each unique entry
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
    // Iterate throught our unique entries
    Object.keys(tree).forEach(node => {
        const object = tree[node];

        Database.insertData(
            TABLE,
            'ID, ARTIST_ID, NAME',
            `${object.id}, "${object.artist_id}", ${object.name}`
        );
    });
};

module.exports={
    initReleases,
}