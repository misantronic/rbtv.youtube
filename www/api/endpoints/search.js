var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('search', query.channelId, query.pageToken, encodeURIComponent(query.q)),
        60 * 60 * 24 * 2 // 2 days
    );

    request(res, 'search', query, cacheConfig);
};