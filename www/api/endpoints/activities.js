var request = require('../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var config = new request.Config({
        response: res,
        endpoint: 'activities',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('activities', query.channelId, query.pageToken, query.maxResults),
            60 * 2 // 2 mins
        )
    });

    request(config).then(function (result) {
        request.end(res, result.data);
    });
};