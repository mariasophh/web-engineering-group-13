const json = require('../assets/music.json');
const Database = require('../Database');
const Utilities = require('../Utilities');
const TABLE = 'SONGS';

/**
 * This function queries the songs table and retrieves a song with a given id
 * @param {Object} req 
 * @param {Object} res 
 */
const getSong = (req, res) => {
    const { id } = req.params;
    const { contentType } = req.query;
    
    Database.fetchTable('*', TABLE, response => {
        Utilities.responseHandlingGET(res, response, contentType);
    }, `ID = "${id}"`);
};

/**
 * This function updates the attributes of a song given the request;
 * @param {Object} req 
 * @param {Object} res 
 */
const updateSong = (req, res) => {
    const { body } = req;
    const { id } = req.params;
    let set = '';

    delete body.NAME;
    delete body.ID;
    delete body.TITLE;
    
    Object.keys(body).forEach((param, i) => {
        const comma = Object.keys(body).length === i + 1
            ? ''
            : ', ';

        set += `${param.toUpperCase()} = ${body[param]}${comma}`;
    });

    Database.updateTable(TABLE, set, response => {
        Utilities.responseHandlingCUD(res, response);
    }, `ID = "${id}"`);
};

/**
 * This function will create a new song resource in the database
 * @param {Object} req 
 * @param {Object} res 
 */
const createSong = (req, res) => {
    const { body } = req;
    const { id } = req.params;

    Database.insertData(
        TABLE,
        'ID, RELEASE_ID, HOTTTNESSS, TITLE, YEAR, ARTIST_MBTAGS, ARTIST_MBTAGS_COUNT, BARS_CONFIDENCE, BARS_START, BEATS_CONFIDENCE, BEATS_START, DURATION, END_OF_FADE_IN, KEY, LOUDNESS, KEY_CONFIDENCE, MODE, MODE_CONFIDENCE, START_OF_FADE_OUT, TATUMS_CONFIDENCE, TATUMS_START, TEMPO, TIME_SIGNATURE, TIME_SIGNATURE_CONFIDENCE',
        `"${id}", ${body.RELEASE_ID}, ${body.HOTTTNESSS}, "${body.TITLE}", ${body.YEAR}, ${body.ARTIST_MBTAGS}, ${body.ARTIST_MBTAGS_COUNT}, ${body.BARS_CONFIDENCE}, ${body.BARS_START}, ${body.BEATS_CONFIDENCE}, ${body.BEATS_START}, ${body.DURATION}, ${body.END_OF_FADE_IN}, ${body.KEY}, ${body.LOUDNESS}, ${body.KEY_CONFIDENCE}, ${body.MODE}, ${body.MODE_CONFIDENCE}, ${body.START_OF_FADE_OUT}, ${body.TATUMS_CONFIDENCE}, ${body.TATUMS_START}, ${body.TEMPO}, ${body.TIME_SIGNATURE}, ${body.TIME_SIGNATURE_CONFIDENCE}`,
        response => {
            Utilities.responseHandlingGET(res, response);
    })
};

/**
 * This function gets all the songs by all artists in a given genre;
 * @param {Object} req 
 * @param {Object} res 
 */
const getSongsTerm = (req, res) => {
    const { terms } = req.params;
    const { contentType } = req.query;

    Database.filterByTerms(terms, response => {
        Utilities.responseHandlingGET(res, response, contentType);
    })
}

/**
 * This function gets all the songs by a specific artist;
 * @param {Object} req 
 * @param {Object} res 
 */
const getSongs = (req, res) => {
    const { id } = req.params;
    const { contentType, year } = req.query;
    
    Database.joinTables(id, response => {
        Utilities.responseHandlingGET(res, response, contentType);
    }, year);
};

/**
 * This function gets all the songs in the database;
 * @param {Object} req 
 * @param {Object} res 
 */
const getAllSongs = (req, res) => {
    const { contentType } = req.query;

    Database.fetchTable(
        'TITLE AS NAME, HOTTTNESSS, YEAR, ID',
        TABLE,
        response => {
            Utilities.responseHandlingGET(res, response, contentType);
        }
    );
};

/**
 * This function gets all the songs in a specific year;
 * with the possibility of retrieving ranked results in a [offset, limit] interval;
 * @param {Object} req 
 * @param {Object} res 
 */
const getYearSongs = (req, res) => {
    const { year } = req.params;
    const { contentType, rankBy, order, offset, limit } = req.query;
    let orderBy = '';

    // remove contentType property for database filtering
    if(contentType) delete req.query.contentType;
    
    if (rankBy) {
        // query parameters for ordering the data and limiting the data with an offset
        orderBy = ` ORDER BY ${rankBy.toUpperCase()} ${order ? order.toUpperCase() : 'DESC'}`;
        
        if (limit && limit != 'end') {
            orderBy += ` LIMIT ${limit}`;
        }
        if (offset && offset !== 'start' && limit && limit != 'end') {
            orderBy += ` OFFSET ${offset}`;
        }
    }

    Database.fetchTable('ID, TITLE AS NAME, YEAR', TABLE, response => {
        Utilities.responseHandlingGET(res, response, contentType);
    }, `YEAR = ${year}` + orderBy);
}

/**
 * This function deletes a song (row) from the songs table for a given id
 * @param {Object} req 
 * @param {Object} res 
 */
const deleteSong = (req, res) => {
    const { id } = req.params;

    Database.deleteRow(
        TABLE,
        `ID = "${id}"`,
        response => {
            Utilities.responseHandlingCUD(res, response);
        }
    );
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
            `"${object.id}", ${object.release_id}, ${object.hotttnesss}, "${object.title}", ${object.year}, ${object.artist_mbtags}, ${object.artist_mbtags_count}, ${object.bars_confidence}, ${object.bars_start}, ${object.beats_confidence}, ${object.beats_start}, ${object.duration}, ${object.end_of_fade_in}, ${object.key}, ${object.loudness}, ${object.key_confidence}, ${object.mode}, ${object.mode_confidence}, ${object.start_of_fade_out}, ${object.tatums_confidence}, ${object.tatums_start}, ${object.tempo}, ${object.time_signature}, ${object.time_signature_confidence}`,
            response
        );
    });
};

module.exports={
    getSong,
    updateSong,
    createSong,
    getSongs,
    getSongsTerm,
    deleteSong,
    getYearSongs,
    getAllSongs,
    initSongs,
}
