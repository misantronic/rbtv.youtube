var _       = require('underscore');
var param   = require('node-jquery-param');
var request = require('./../request');
var cache   = require('../cache');

module.exports = function (req, res) {
    var output      = { items: [] };
    var cacheConfig = new cache.Config('playlists', 60 * 60 * 24);

    function performRequest(channelId, pageToken, callback) {
        pageToken = pageToken || '';

        request(
            new request.Config({
                endpoint: 'playlists',
                query: {
                    part: 'snippet,contentDetails',
                    maxResults: 50,
                    channelId: channelId,
                    pageToken: pageToken
                }
            })
        ).then(result => {
            var data = result.data;

            output.items = output.items.concat(result.data.items);

            if (data.nextPageToken) {
                performRequest(channelId, data.nextPageToken, callback)
            } else {
                // Done
                callback();
            }
        });
    }

    cache.get(cacheConfig, function (err, val) {
        if(val) {
            // Cached data
            request.end(res, val);
        } else {
            // Fetch all playlists
            performRequest('UCQvTDmHza8erxZqDkjQ4bQQ', null, function () {
                performRequest('UCtSP1OA6jO4quIGLae7Fb4g', null, function () {
                    var outputStr = JSON.stringify(output);

                    // Done
                    request.end(res, outputStr);

                    // Cache
                    cache.set(cacheConfig, outputStr);
                });
            });
        }
    });
};