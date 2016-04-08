var db = require('../../db');

module.exports = db.model('Videos', new db.Schema({
    _id: String,
    id: String,
    kind: String,
    etag: String,
    expires: { type: Date, default: Date.now },
    snippet: {
        categoryId: String,
        channelId: String,
        title: String,
        description: String,
        tags: [],
        publishedAt: { type: Date, default: Date.now },
        thumbnails: {
            default: {
                width: Number,
                heiht: Number,
                url: String
            },
            medium: {
                width: Number,
                heiht: Number,
                url: String
            },
            high: {
                width: Number,
                heiht: Number,
                url: String
            },
            standard: {
                width: Number,
                heiht: Number,
                url: String
            },
            maxres: {
                width: Number,
                heiht: Number,
                url: String
            }
        }
    }
}));