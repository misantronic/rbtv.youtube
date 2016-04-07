var request = require('../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('activities', query.channelId, query.pageToken, query.maxResults),
        60 * 2 // 2 mins
    );

    request(res, 'activities', query, cacheConfig);
};