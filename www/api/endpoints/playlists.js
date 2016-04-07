var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    request(
        new request.Config({
            response: res,
            endpoint: 'playlists',
            query: query,
            cacheConfig: new cache.Config(
                cache.rk('playlists', query.channelId, query.pageToken, query.maxResults),
                60 * 60 * 24 * 3 // 3 days
            )
        })
    );
};