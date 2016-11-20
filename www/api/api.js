require('./../db/db');

module.exports = {
    init: function (app) {
        app.get('/api/activities', require('./endpoints/activities'));

        app.get('/api/playlists', require('./endpoints/playlists'));

        app.get('/api/playlistItems', require('./endpoints/playlistItems'));

        app.get('/api/search', require('./endpoints/search'));

        app.get('/api/related', require('./endpoints/related'));

        app.get('/api/videos', require('./endpoints/videos'));

        app.get('/api/comments', require('./endpoints/comments'));

        app.get('/api/cache.invalidate', require('./endpoints/cacheInvalidate'));

        app.get('/api/commentThreads', require('./endpoints/commentThreads'));
    }
};
