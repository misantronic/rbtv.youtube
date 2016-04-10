var fetch = require('../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = {
        part: 'snippet,contentDetails',
        maxResults: 30,
        channelId: req.query.channelId,
        pageToken: req.query.pageToken
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'activities',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('activities', query.channelId, query.pageToken, query.maxResults),
            60 * 2 // 2 mins
        )
    });

    fetch(config).then(function (result) {
        fetch.end(res, result.data);
    });
};