var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var config = new request.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('search', query.channelId, query.pageToken, encodeURIComponent(query.q)),
            60 * 60 * 24 // 1 days
        )
    });

    request(config).then(function (result) {
        request.end(res, result.data);
    });
};