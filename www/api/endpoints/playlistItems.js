var _       = require('underscore');
var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var playlistId  = req.query.playlistId;
    var output      = { items: [] };
    var cacheConfig = new cache.Config(cache.rk('playlistItems', playlistId), 60 * 60 * 24);

    function performRequest(pageToken, callback) {
        pageToken = pageToken || '';

        request(
            new request.Config({
                endpoint: 'playlistItems',
                query: {
                    part: 'snippet,contentDetails',
                    maxResults: 50,
                    playlistId: playlistId,
                    pageToken: pageToken
                }
            })
        ).then(result => {
            var data = result.data;

            output.items = output.items.concat(result.data.items);

            if (data.nextPageToken) {
                performRequest(data.nextPageToken, callback)
            } else {
                // Done
                callback();
            }
        });
    }

    cache.get(cacheConfig, function (err, val) {
        if (val) {
            // Cached data
            request.end(res, val);
        } else {
            // Fetch all playlists
            performRequest(null, function () {
                var outputStr = JSON.stringify(output);

                // Done
                request.end(res, outputStr);

                // Cache
                cache.set(cacheConfig, outputStr);
            });
        }
    });
};