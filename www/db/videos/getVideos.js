var _          = require('underscore');
var moment     = require('moment');
var Promise    = require('promise');
var VideoModel = require('./models/Video');

/**
 *
 * @param {Array} videoIds
 * @returns {Promise}
 */
module.exports = function (videoIds) {
    return new Promise(function (resolve, reject) {
        var numVideos     = videoIds.length;
        var itemsNotFound = [];
        var itemsFromDB   = [];
        var cnt           = 0;
        var now           = moment();

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
    });
};