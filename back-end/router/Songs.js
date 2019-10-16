const json = require('../assets/music.json');
const Database = require('../Database');
const Utilities = require('../Utilities');
const TABLE = 'SONGS';

/**
 * This function queries the songs table and retrieves a song with a given id
 * @param {Array} req 
 * @param {Array} res 
 */
const getSong = (req, res) => {
    const { id } = req.params;
    const { contentType } = req.query;
    
    Database.fetchTable('*', TABLE, response => {
        res.status(200).send((contentType && contentType === 'csv')
            ? Utilities.toCSV(response)
            : response
        );
    }, `ID = "${id}"`);
};

/**
 * This function updates the attributes of a song given in the 
 * request body
 * @param {Array} req 
 * @param {Array} res 
 */
const updateSong = (req, res) => {
    const { body } = req;
    const { id } = req.params;
    let set = '';
    
    Object.keys(body).forEach((param, i) => {
        const comma = Object.keys(body).length === i + 1
            ? ''
            : ', ';

        set += `${param.toUpperCase()} = ${body[param]}${comma}`;
    });
    
    Database.updateTable(TABLE, set, () => {
        res.status(200).send(`SONG WITH ID ${id} SUCCESSFULLY UPDATED`);
    }, `ID = "${id}"`);
};

/**
 * This function gets all the songs by a specific artist
 * @param {Array} req 
 * @param {Array} res 
 */
const getSongs = (req, res) => {
    const { id } = req.params;
    const { contentType } = req.params;

    Database.joinTables(id, response => {
        res.status(200).send((contentType && contentType === 'csv')
            ? Utilities.toCSV(response)
            : response
        );
    });
};

/**
 * This function gets all the songs in a specific year
 * @param {Array} req 
 * @param {Array} res 
 */
const getYearSongs = (req, res) => {
    const { year } = req.params;
    const { contentType } = req.query;

    Database.fetchTable('*', TABLE, response => {
        res.status(200).send((contentType && contentType === 'csv')
            ? Utilities.toCSV(response)
            : response
        );
    }, `YEAR = ${year}`);
}

/**
 * This function deletes a song (row) from the songs table for a given id
 * @param {Array} req 
 * @param {Array} res 
 */
const deleteSong = (req, res) => {
    const { id } = req.params;

    Database.deleteRow(
        TABLE,
        `ID = "${id}"`
    );

    res.status(200).send(`SONG WITH ID ${id} SUCCESSFULLY REMOVED`);
    // res.status(404).send('RESOURCE NOT AVAILABLE!');
}

/**
 * This function initialises the SONGS table and
 * populates it with the initial given values
 */
const initSongs = () => {
    Database.dropTable(TABLE);

    Database.createTable(
        TABLE,
        'ID CHAR PRIMARY KEY, RELEASE_ID INT, HOTTTNESSS FLOAT, TITLE TEXT, YEAR INT, ARTIST_MBTAGS FLOAT, ARTIST_MBTAGS_COUNT FLOAT, BARS_CONFIDENCE FLOAT, BARS_START FLOAT, BEATS_CONFIDENCE FLOAT, BEATS_START FLOAT, DURATION FLOAT, END_OF_FADE_IN FLOAT, KEY FLOAT, LOUDNESS FLOAT, KEY_CONFIDENCE FLOAT, MODE INT, MODE_CONFIDENCE FLOAT, START_OF_FADE_OUT FLOAT, TATUMS_CONFIDENCE FLOAT, TATUMS_START FLOAT, TEMPO FLOAT, TIME_SIGNATURE FLOAT, TIME_SIGNATURE_CONFIDENCE FLOAT'
    );

    // Parse the .txt file with song names (titles)
    const file = Utilities.read_file('./assets/song_titles.txt');
    const songs = {};
    const lines = file.split('\n');
    lines.forEach(line => {
        const s = line.split('<SEP>');
        songs[s[1]] = s[3];
    });

    // Parse the json and populate the table
    json.forEach(element => {
        const object = {};

        Object.keys(element).forEach(sub => {
            if (sub.includes('song.')) {
                const key = sub.split('.')[1];
                object[key] = element[sub];
            }
            object.release_id = element['release.id'];
            object.title = songs[object.id];
        });
        
        Database.insertData(
            TABLE,
            'ID, RELEASE_ID, HOTTTNESSS, TITLE, YEAR, ARTIST_MBTAGS, ARTIST_MBTAGS_COUNT, BARS_CONFIDENCE, BARS_START, BEATS_CONFIDENCE, BEATS_START, DURATION, END_OF_FADE_IN, KEY, LOUDNESS, KEY_CONFIDENCE, MODE, MODE_CONFIDENCE, START_OF_FADE_OUT, TATUMS_CONFIDENCE, TATUMS_START, TEMPO, TIME_SIGNATURE, TIME_SIGNATURE_CONFIDENCE',
            `"${object.id}", ${object.release_id}, ${object.hotttnesss}, "${object.title}", ${object.year}, ${object.artist_mbtags}, ${object.artist_mbtags_count}, ${object.bars_confidence}, ${object.bars_start}, ${object.beats_confidence}, ${object.beats_start}, ${object.duration}, ${object.end_of_fade_in}, ${object.key}, ${object.loudness}, ${object.key_confidence}, ${object.mode}, ${object.mode_confidence}, ${object.start_of_fade_out}, ${object.tatums_confidence}, ${object.tatums_start}, ${object.tempo}, ${object.time_signature}, ${object.time_signature_confidence}`
        );
    });
};

module.exports={
    getSong,
    updateSong,
    getSongs,
    deleteSong,
    getYearSongs,
    initSongs,
}
