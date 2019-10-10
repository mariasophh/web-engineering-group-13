const express = require('express');
const app = express();
const PORT = 3000;

const Artists = require('./router/Artists');
const Releases = require('./router/Releases');
const Songs = require('./router/Songs');

app.get('/artists', Artists.getArtists);

app.post('/populateDB', (req, res) => {
    Artists.initArtists();
    Releases.initReleases();
    Songs.initSongs();

    res.status(200).send('Populating was successfull');
});

app.get('/', (req, res) => {
    const base = `http://localchost:${PORT}`;
    const stack = [];

    app._router.stack.forEach(layer => {
        if (layer.route && layer.route.path && layer.route.path !== '/') {
            stack.push(base + layer.route.path);
        }
    });

    res.status(200).send(stack);
});

app.listen(3000);
console.log(`Listening app at http://localhost:${PORT}`)
