var _          = require('underscore');
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

        // Check videoIds in mongoDB
        _.each(videoIds, function (videoId) {
            VideoModel.findById(videoId, function (err, videoObj) {
                if (videoObj) {
                    itemsFromDB.push(videoObj);
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