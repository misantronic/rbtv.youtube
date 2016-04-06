var _          = require('underscore');
var request    = require('./../request');
var cache      = require('../cache');
var db         = require('../db');
var VideoModel = require('../models/Video');

module.exports = function (req, res) {
    var query = req.query;

    var cacheConfig = new cache.Config(
        'videos.' + query.id,
        60 * 60 * 24 * 7 // 7 days
    );

    request(res, 'videos', query, cacheConfig)
        .done((videoData) => {
            _.each(videoData.items, function (videoItem) {
                VideoModel.findById(videoItem.id, function (err, res) {
                    if (!res) {
                        var video = new VideoModel({
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

                        video.save(function (err) {
                            if (err) {
                                console.error('Error trying to save videoItem', err)
                            }
                        });
                    }
                });
            });
        });
};