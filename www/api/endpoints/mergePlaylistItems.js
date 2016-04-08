var cache = require('../cache');

module.exports = function (req, res) {
    var playlistItems = req.body;
    var query         = req.query;

    cache.set(
        new cache.Config(cache.rk('playlistItems', query.playlistId), 60 * 60),
        JSON.stringify(playlistItems)
    );

    res.end('1');
};