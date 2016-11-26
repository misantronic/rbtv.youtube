const _ = require('underscore');
const fetch = require('./../fetch');
const cache = require('../cache');
const Config = require('../../../app/Config');

module.exports = function (req, res) {
    const query = {
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

    const config = new fetch.Config({
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
        result.data.items = _.filter(
            result.data.items,
            item => _.filter(
                Config.channels,
                channel => channel.id === item.snippet.channelId
            ).length
        );

        fetch.end(res, result.data);
    });
};
