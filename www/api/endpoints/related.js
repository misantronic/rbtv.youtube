var _     = require('underscore');
var fetch = require('./../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = {
        part: 'snippet',
        maxResults: 6,
        type: 'video',
        order: 'relevance',
        regionCode: 'DE',
        relevanceLanguage: 'de',
        relatedToVideoId: req.query.relatedToVideoId,
        pageToken: req.query.pageToken,
        channelId: req.query.channelId
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('related', query.channelId, query.relatedToVideoId, query.pageToken),
            60 * 60 * 24 // 1 days
        )
    });

    fetch(config).then(function (result) {
        // Filter data
        // TODO: Do this before caching data
        result.data.items = _.filter(result.data.items, item => {
            return item.snippet.channelId === 'UCQvTDmHza8erxZqDkjQ4bQQ' || item.snippet.channelId === 'UCtSP1OA6jO4quIGLae7Fb4g';
        });

        fetch.end(res, result.data);
    });
};