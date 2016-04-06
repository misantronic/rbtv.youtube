var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        'search.'+ query.channelId + '_'+ query.pageToken + '_'+ encodeURIComponent(query.q),
        60 * 60 * 24 // 3 days
    );

    request(res, 'search', query, cacheConfig);
};