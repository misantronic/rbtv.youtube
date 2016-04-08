var fetch = require('./../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var config = new fetch.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('search', query.channelId, query.pageToken, encodeURIComponent(query.q)),
            60 * 60 * 24 // 1 days
        )
    });

    fetch(config).then(function (result) {
        fetch.end(res, result.data);
    });
};