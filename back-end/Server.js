const express = require('express');
const app = express();

const Artists = require('./router/Artists');

app.get('/artists', Artists.getArtists);
app.post('/addArtist', Artists.addArtist);

app.listen(3000);
