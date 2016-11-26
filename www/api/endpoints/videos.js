const _ = require('underscore');
const moment = require('moment');
const Promise = require('promise');
const fetch = require('./../fetch');
const cache = require('../cache');
const VideoModel = require('../../db/videos/models/Video');
const dbSaveVideo = require('../../db/videos/saveVideo');
const dbGetVideos = require('../../db/videos/getVideos');

module.exports = function (req, res) {
    let { id, fromCache, liveStreamingDetails } = req.query;

    fromCache = fromCache === 'true';
    liveStreamingDetails = liveStreamingDetails === 'true';

    const videoIds = id.split(',');
    let part = 'snippet,contentDetails,statistics';

    if (liveStreamingDetails) {
        part += ',liveStreamingDetails';
    }

    console.time('Mongo: getVideos()');

    dbGetVideos(videoIds, fromCache)
        .then(result => {
            const itemsFromDB = result.itemsFromDB;
            const itemsNotFound = result.itemsNotFound;

            console.timeEnd('Mongo: getVideos()');
            console.log('-> Found:', itemsFromDB.length + ', Not found:', itemsNotFound.length);

            const config = new fetch.Config({
                endpoint: 'videos',
                query: {
                    part,
                    maxResults: 50,
                    id: itemsNotFound.join(',')
                }
            });

            if (!config.query.id) {
                fetch.end(res, itemsFromDB);
                return;
            }

            fetch(config).then(result => {
                const fromCache = result.fromCache;
                const items = result.data.items.concat(itemsFromDB);

                fetch.end(res, items);

                if (!fromCache) {
                    // Save/Update videos in mongoDB
                    _.each(result.data.items, function (item) {
                        item._id = item.id;
                        item.expires = moment().add(3, 'hours').toDate();

                        dbSaveVideo(item);
                    });
                }
            });
        });
};
