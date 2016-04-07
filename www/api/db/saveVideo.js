var _          = require('underscore');
var VideoModel = require('./models/Video');

module.exports = function (videoItem) {
    VideoModel.findById(videoItem._id, function (err, videoObj) {
        if (videoObj) {
            // Update
            VideoModel.findByIdAndUpdate(
                videoItem._id,
                { $set: _.omit(videoItem, '_id') },
                function (err) {
                    if (err) {
                        console.error('Mongo: Error trying to update videoItem', err)
                    }
                }
            )
        } else {
            // Save
            new VideoModel(videoItem)
                .save(function (err) {
                    if (err) {
                        console.error('Mongo: Error trying to save videoItem', err)
                    }
                });
        }
    });
};