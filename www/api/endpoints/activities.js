var fetch = require('../fetch');
var cache = require('../cache');
var _ = require('underscore');

module.exports = function (req, res) {
    var query = {
        part: 'snippet,contentDetails,id',
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
            60 * 5 // 5 mins
        )
    });

    fetch(config).then(function (result) {
        result.data.items = _.filter(result.data.items, item => item.snippet.type === 'upload');

        fetch.end(res, result.data);
    });
};
