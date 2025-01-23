const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlists');
const trackRoutes = require('./routes/tracks');
const app = express();
const PORT = 3999

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/tracks', trackRoutes);

app.listen(3999, () => {
  console.log(`Server is running on port ${PORT}`);
});