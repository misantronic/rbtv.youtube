var fetch = require('./../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = {
        part: 'snippet',
        maxResults: 30,
        type: 'video',
        q: req.query.q,
        pageToken: req.query.pageToken,
        channelId: req.query.channelId
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('search', query.channelId, encodeURIComponent(query.q), query.pageToken),
            60 * 60 * 24 // 1 days
        )
    });

    fetch(config).then(function (result) {
        fetch.end(res, result.data);
    });
};