var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('playlists', query.channelId, query.pageToken, query.maxResults),
        60 * 60 * 24 * 7 // 7 days
    );

    request(res, 'playlists', query, cacheConfig);
};