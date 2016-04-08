require('./../db/db');

module.exports = {
    init: function (app) {
        app.get('/api/activities', require('./endpoints/activities'));

        app.get('/api/playlists', require('./endpoints/playlists'));

        app.get('/api/playlistItems', require('./endpoints/playlistItems'));

        app.get('/api/search', require('./endpoints/search'));

        app.get('/api/videos', require('./endpoints/videos'));

        app.post('/api/mergePlaylists', require('./endpoints/mergePlaylists'));
        
        app.post('/api/mergePlaylistItems', require('./endpoints/mergePlaylistItems'));
    }
};