var _ = require('underscore');
var param = require('node-jquery-param');
var Promise = require('promise');
var moment = require('moment');
var fetch = require('./../fetch');
var cache = require('../cache');
var dbGetPlaylists = require('../../db/playlists/getPlaylists');
var dbSavePlaylist = require('../../db/playlists/savePlaylist');

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

    var playlistIds = req.query.id ? req.query.id.split(',') : null;
    var fromCache = _.isUndefined(req.query.fromCache) ? true : req.query.fromCache === 'true';

    function getAllPlaylists() {
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
                    initRequest('UCtSP1OA6jO4quIGLae7Fb4g'),
                    initRequest('UCFBapHA35loZ3KZwT_z3BsQ')
                ]).then(requestResult => {
                    output.items = output.items.concat(requestResult[0], requestResult[1], requestResult[2]);

                    var outputStr = JSON.stringify(output);

                    // Done
                    fetch.end(res, outputStr);

                    // Cache
                    cache.set(cacheConfig, output);
                });
            });
    }

    function getPlaylists() {
        console.time('Mongo: getPlaylists()');

        dbGetPlaylists(playlistIds, fromCache)
            .then(result => {
                var itemsFromDB = result.itemsFromDB;
                var itemsNotFound = result.itemsNotFound;

                console.timeEnd('Mongo: getPlaylists()');
                console.log('-> Found:', itemsFromDB.length + ', Not found:', itemsNotFound.length);

                var config = new fetch.Config({
                    endpoint: 'playlists',
                    query: {
                        part: 'snippet,contentDetails,status',
                        maxResults: 50,
                        id: itemsNotFound.join(',')
                    }
                });

                if (!config.query.id) {
                    output.items = itemsFromDB;

                    fetch.end(res, output);
                    return;
                }

                fetch(config).then(result => {
                    var fromCache = result.fromCache;

                    output.items = result.data.items.concat(itemsFromDB);

                    fetch.end(res, output);

                    if (!fromCache) {
                        // Save/Update videos in mongoDB
                        _.each(result.data.items, function (item) {
                            item._id = item.id;
                            item.expires = moment().add(7, 'days').toDate();

                            dbSavePlaylist(item);
                        });
                    }
                });
            });
    }

    if (playlistIds) {
        getPlaylists();
    } else {
        getAllPlaylists();
    }
};
