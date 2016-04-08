var _       = require('underscore');
var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var query = req.query;

    var performRequest = () => {
        request(
            new request.Config({
                response: res,
                endpoint: 'playlists',
                query: query,
                cacheConfig: new cache.Config(
                    cache.rk('playlists', query.channelId, query.pageToken, query.maxResults),
                    60 * 60 * 24 * 3 // 3 days
                )
            })
        );
    };

    if (!_.keys(query).length) {
        // No parameters given: Check cache for playlists
        cache.get(new cache.Config('playlists'), (err, value) => {
            if (!value) {
                value = 'false';
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(value);
        })
    } else {
        performRequest();
    }
};