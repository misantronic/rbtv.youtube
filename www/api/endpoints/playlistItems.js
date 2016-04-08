var _     = require('underscore');
var fetch = require('./../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var playlistId  = req.query.playlistId;
    var output      = { items: [] };
    var cacheConfig = new cache.Config(cache.rk('playlistItems', playlistId), 60 * 60 * 24);

    function performRequest(pageToken, callback) {
        pageToken = pageToken || '';

        var config = new fetch.Config({
            endpoint: 'playlistItems',
            query: {
                part: 'snippet,contentDetails',
                maxResults: 50,
                playlistId: playlistId,
                pageToken: pageToken
            }
        });

        fetch(config).then(result => {
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
            fetch.end(res, val);
        } else {
            // Fetch all playlists
            performRequest(null, function () {
                var outputStr = JSON.stringify(output);

                // Done
                fetch.end(res, outputStr);

                // Cache
                cache.set(cacheConfig, outputStr);
            });
        }
    });
};