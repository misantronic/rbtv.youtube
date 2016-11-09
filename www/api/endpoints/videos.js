var _ = require('underscore');
var moment = require('moment');
var Promise = require('promise');
var fetch = require('./../fetch');
var cache = require('../cache');
var VideoModel = require('../../db/videos/models/Video');
var dbSaveVideo = require('../../db/videos/saveVideo');
var dbGetVideos = require('../../db/videos/getVideos');

module.exports = function (req, res) {
    var videoIds = req.query.id.split(',');
    var fromCache = _.isUndefined(req.query.fromCache) ? true : req.query.fromCache === 'true';

    console.time('Mongo: getVideos()');

    dbGetVideos(videoIds, fromCache)
        .then(result => {
            var itemsFromDB = result.itemsFromDB;
            var itemsNotFound = result.itemsNotFound;

            console.timeEnd('Mongo: getVideos()');
            console.log('-> Found:', itemsFromDB.length + ', Not found:', itemsNotFound.length);

            var config = new fetch.Config({
                endpoint: 'videos',
                query: {
                    part: 'snippet,contentDetails,statistics',
                    maxResults: 50,
                    id: itemsNotFound.join(',')
                }
            });

            if (!config.query.id) {
                fetch.end(res, itemsFromDB);
                return;
            }

            fetch(config).then(result => {
                var fromCache = result.fromCache;
                var items = result.data.items.concat(itemsFromDB);

                fetch.end(res, items);

                if (!fromCache) {
                    // Save/Update videos in mongoDB
                    _.each(result.data.items, function (item) {
                        item._id = item.id;
                        item.expires = moment().add(7, 'days').toDate();

                        dbSaveVideo(item);
                    });
                }
            });
        });
};
