var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    request(new request.Config({
        response: res,
        endpoint: 'playlistItems',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('playlistItem', query.playlistId, query.pageToken, query.maxResults),
            60 * 60 // 60 mins
        )
    }));
};