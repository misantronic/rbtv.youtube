const fetch = require('../fetch');
const cache = require('../cache');

module.exports = function (req, res) {
    const query = {
        part: 'snippet',
        maxResults: 15,
        order: 'relevance',
        videoId: req.query.videoId,
        pageToken: req.query.pageToken
    };

    const config = new fetch.Config({
        response: res,
        endpoint: 'commentThreads',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('commentThreads', query.videoId, query.pageToken),
            60 * 10 // 5 mins
        )
    });

    fetch(config).then(result => fetch.end(res, result.data));
};
