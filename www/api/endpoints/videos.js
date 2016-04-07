var _          = require('underscore');
var request    = require('./../request');
var cache      = require('../cache');
var VideoModel = require('../../db/models/Video');
var saveVideo  = require('../../db/saveVideo');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        cache.rk('videos', query.id),
        60 * 60 * 24 * 7 // 7 days
    );

    request(res, 'videos', query, cacheConfig)
        .done((videoData, fromCache) => {
            if (!fromCache) {
                // Save/Update videos in mongoDB
                _.each(videoData.items, function (videoItem) {
                    saveVideo({
                        _id: videoItem.id,
                        etag: videoItem.etag,
                        kind: videoItem.kind,
                        channelId: videoItem.snippet.channelId,
                        description: videoItem.snippet.description,
                        publishedAt: videoItem.snippet.publishedAt,
                        thumbnails: videoItem.snippet.thumbnails,
                        tags: videoItem.snippet.tags,
                        title: videoItem.snippet.title
                    });
                });
            }
        });
};