var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        'playlistItem.'+ query.playlistId +'_'+ query.pageToken +'_'+ query.maxResults,
        60 * 10 // 10 mins
    );

    request(res, 'playlistItems', query, cacheConfig);
};