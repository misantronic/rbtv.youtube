const _ = require('underscore');
const param = require('node-jquery-param');
const Promise = require('promise');
const moment = require('moment');
const fetch = require('./../fetch');
const cache = require('../cache');
const Config = require('../../../app/Config');
const dbGetPlaylists = require('../../db/playlists/getPlaylists');
const dbSavePlaylist = require('../../db/playlists/savePlaylist');

function initRequest(channelId) {
    var items = [];

    return new Promise(function (resolve, reject) {
        function performRequest(pageToken) {
            pageToken = pageToken || '';

            const config = new fetch.Config({
                endpoint: 'playlists',
                query: {
                    part: 'snippet,contentDetails',
                    maxResults: 50,
                    channelId: channelId,
                    pageToken: pageToken
                }
            });

            fetch(config).then(result => {
                const data = result.data;

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

    const output = { items: [] };

    const playlistIds = req.query.id ? req.query.id.split(',') : null;
    const fromCache = _.isUndefined(req.query.fromCache) ? true : req.query.fromCache === 'true';

    function getAllPlaylists() {
        const cacheConfig = new cache.Config(
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

                const requests = _.map(Config.channels, channel => initRequest(channel.id));

                // Fetch all playlists
                Promise.all(requests).then(requestResult => {
                    output.items = output.items.concat(...requestResult);

                    const outputStr = JSON.stringify(output);

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
                const itemsFromDB = result.itemsFromDB;
                const itemsNotFound = result.itemsNotFound;

                console.timeEnd('Mongo: getPlaylists()');
                console.log('-> Found:', itemsFromDB.length + ', Not found:', itemsNotFound.length);

                const config = new fetch.Config({
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
                    const fromCache = result.fromCache;

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
