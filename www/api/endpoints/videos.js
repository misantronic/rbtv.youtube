var _          = require('underscore');
var moment     = require('moment');
var Promise    = require('promise');
var fetch      = require('./../fetch');
var cache      = require('../cache');
var VideoModel = require('../../db/videos/models/Video');
var saveVideo  = require('../../db/videos/saveVideo');
var getVideos  = require('../../db/videos/getVideos');

module.exports = function (req, res) {
    var videoIds = req.query.id.split(',');

    getVideos(videoIds)
        .then(videoResult => {
            var itemsFromDB   = videoResult.itemsFromDB;
            var itemsNotFound = videoResult.itemsNotFound;

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
                var items     = result.data.items.concat(itemsFromDB);

                fetch.end(res, items);

                if (!fromCache) {
                    // Save/Update videos in mongoDB
                    _.each(result.data.items, function (videoItem) {
                        videoItem._id     = videoItem.id;
                        videoItem.expires = moment().add(7, 'days').toDate();

                        saveVideo(videoItem);
                    });
                }
            });
        });
};