var _       = require('underscore');
var param   = require('node-jquery-param');
var Promise = require('promise');
var fetch   = require('./../fetch');
var cache   = require('../cache');

function initRequest(channelId) {
    var items = [];

    return new Promise(function (resolve, reject) {
        function performRequest(pageToken) {
            pageToken = pageToken || '';

            var config = new fetch.Config({
                endpoint: 'playlists',
                query: {
                    part: 'snippet,contentDetails',
                    maxResults: 50,
                    channelId: channelId,
                    pageToken: pageToken
                }
            });

            fetch(config).then(result => {
                var data = result.data;

                items = items.concat(data.items);

                if (data.nextPageToken) {
                    performRequest(data.nextPageToken)
                } else {
                    // Done
                    resolve(items)
                }
            });
        }

        performRequest();
    });
}

module.exports = function (req, res) {
    var output = { items: [] };

    var cacheConfig = new cache.Config(
        cache.rk('playlists'),
        60 * 60 * 24
    );

    cache.get(cacheConfig)
        .done(value => {
            if (value) {
                // Cached data
                fetch.end(res, value);
                return;
            }

            // Fetch all playlists
            Promise.all([
                initRequest('UCQvTDmHza8erxZqDkjQ4bQQ'),
                initRequest('UCtSP1OA6jO4quIGLae7Fb4g')
            ]).then(requestResult => {
                output.items = output.items.concat(requestResult[0], requestResult[1]);

                var outputStr = JSON.stringify(output);

                // Done
                fetch.end(res, outputStr);

                // Cache
                cache.set(cacheConfig, output);
            });
        });
};