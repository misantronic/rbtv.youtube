var cache = require('../cache');

module.exports = function (req, res) {
    var playlists = req.body;

    cache.set(
        new cache.Config('playlists', 60 * 60 * 24 * 3),
        JSON.stringify(playlists)
    );

    res.end('1');
};