var db = require('../../db');

module.exports = db.model('Playlists', new db.Schema({
    _id: String,
    id: String,
    kind: String,
    etag: String,
    expires: { type: Date, default: Date.now },
    snippet: {
        channelTitle: String,
        channelId: String,
        title: String,
        description: String,
        publishedAt: { type: Date, default: Date.now },
        thumbnails: {
            default: {
                width: Number,
                height: Number,
                url: String
            },
            medium: {
                width: Number,
                height: Number,
                url: String
            },
            high: {
                width: Number,
                height: Number,
                url: String
            },
            standard: {
                width: Number,
                height: Number,
                url: String
            },
            maxres: {
                width: Number,
                height: Number,
                url: String
            }
        }
    },
    contentDetails: {
        itemCount: Number
    }
}));
