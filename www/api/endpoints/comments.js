var fetch = require('../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = {
        part: 'snippet',
        maxResults: 30,
        order: 'relevance',
        videoId: req.query.videoId,
        pageToken: req.query.pageToken
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'commentThreads',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('commentThreads', query.videoId, query.pageToken),
            60 * 10 // 5 mins
        )
    });

    fetch(config).then(function (result) {
        fetch.end(res, result.data);
    });
};