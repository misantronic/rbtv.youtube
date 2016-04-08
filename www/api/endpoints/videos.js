var _          = require('underscore');
var moment     = require('moment');
var Promise    = require('promise');
var request    = require('./../request');
var cache      = require('../cache');
var VideoModel = require('../../db/videos/models/Video');
var saveVideo  = require('../../db/videos/saveVideo');
var getVideos  = require('../../db/videos/getVideos');

module.exports = function (req, res) {
    var query    = req.query;
    var videoIds = query.id.split(',');

    getVideos(videoIds)
        .then(videoResult => {
            var itemsFromDB   = videoResult.itemsFromDB;
            var itemsNotFound = videoResult.itemsNotFound;

            // Update query
            query.id = itemsNotFound.join(',');

            request(
                new request.Config({
                    endpoint: 'videos',
                    query: query
                })
            ).then(result => {
                var fromCache = result.fromCache;
                var items     = result.data.items.concat(itemsFromDB);

                request.end(res, items);

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