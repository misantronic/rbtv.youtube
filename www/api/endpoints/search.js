var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('search', query.channelId, query.pageToken, encodeURIComponent(query.q)),
        60 * 60 * 24 // 1 days
    );

    request(
        new request.Config({
            response: res,
            endpoint: 'search',
            query: query,
            cacheConfig: cacheConfig
        })
    );
};