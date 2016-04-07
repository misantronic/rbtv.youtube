var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('playlistItem', query.playlistId, query.pageToken, query.maxResults),
        60 * 60 // 60 mins
    );

    request(res, 'playlistItems', query, cacheConfig);
};