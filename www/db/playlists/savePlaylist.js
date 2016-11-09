var _ = require('underscore');
var Model = require('./models/Playlist');

module.exports = function (item) {
    Model.findById(item._id, function (err, videoObj) {
        if (videoObj) {
            // Update
            Model.findByIdAndUpdate(
                item._id,
                { $set: _.omit(item, '_id', '__v') },
                function (err) {
                    if (err) {
                        console.error('Mongo: Error trying to update playlistItem', err);
                    }
                }
            )
        } else {
            // Save
            new Model(item)
                .save(function (err) {
                    if (err) {
                        console.error('Mongo: Error trying to save playlistItem', err);
                    }
                });
        }
    });
};
