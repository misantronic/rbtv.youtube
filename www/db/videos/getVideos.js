var _          = require('underscore');
var moment     = require('moment');
var Promise    = require('promise');
var VideoModel = require('./models/Video');

/**
 *
 * @param {Array} videoIds
 * @param {Boolean} [fromCache]
 * @returns {Promise}
 */
module.exports = function (videoIds, fromCache) {
    return new Promise(function (resolve, reject) {
        var itemsNotFound = [];
        var itemsFromDB   = [];

        if (fromCache) {
            var numVideos = videoIds.length;
            var cnt       = 0;
            var now       = moment();

            // Check videoIds in mongoDB
            _.each(videoIds, function (videoId) {
                VideoModel.findById(videoId, function (err, videoModel) {
                    if (videoModel) {
                        var expires = moment(videoModel.expires);

                        if (expires.diff(now) > 0) {
                            itemsFromDB.push(
                                _.omit(videoModel.toObject(), '__v', '_id')
                            );
                        } else {
                            itemsNotFound.push(videoId);
                        }
                    } else {
                        itemsNotFound.push(videoId);
                    }

                    if (++cnt >= numVideos) {
                        resolve({
                            itemsFromDB: itemsFromDB,
                            itemsNotFound: itemsNotFound
                        })
                    }
                });
            });
        } else {
            resolve({
                itemsFromDB: itemsFromDB,
                itemsNotFound: videoIds
            })
        }
    });
};