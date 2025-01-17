const express = require('express');
const bodyParser = require('body-parser');
const Utilities = require('./Utilities');
const app = express();
const PORT = 8081;

// Configuration for body parsing and default origins
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// enable CORS
app.use(require('cors')());

// Route specific functions for each request
const Artists = require('./router/Artists');
const Releases = require('./router/Releases');
const Songs = require('./router/Songs');

// API
app.get('/artists', Artists.getArtists);
app.get('/songs', Songs.getAllSongs);
app.get('/songs/:id', Songs.getSong);
app.put('/songs/:id', Songs.updateSong);
app.delete('/songs/:id', Songs.deleteSong);
app.post('/songs/:id', Songs.createSong);
app.get('/songs/year/:year', Songs.getYearSongs)
app.get('/songs/artists/:id', Songs.getSongs);
app.get('/songs/artists/terms/:terms', Songs.getSongsTerm);
app.get('/artists/statistics/:id', Artists.getStatistics);
app.get('/releases/artist/:id', Releases.getReleases);

app.post('/populateDB', (req, res) => {
    Artists.initArtists();
    Releases.initReleases();
    Songs.initSongs();

    res.status(200).send('Populating was successful!');
});

// display all the defined API routes
app.get('/', (req, res) => {
    const base = `http://localhost:${PORT}`;
    const stack = [];

    app._router.stack.forEach(layer => {
        if (layer.route && layer.route.path && layer.route.path !== '/') {
            stack.push(base + layer.route.path);
        }
    });

    res.status(200).send(stack);
});

// wildcard route to match every route that's not defined 
app.get('*', Utilities.nonExistingRoute);

app.listen(PORT);
console.log(`Listening app at http://localhost:${PORT}`)
