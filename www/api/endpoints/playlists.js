var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        'playlists.'+ query.channelId + '_' + query.pageToken + '_' + query.maxResults,
        60 * 60 * 24 * 7 // 7 days
    );

    request(res, 'playlists', query, cacheConfig);
};