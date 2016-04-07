var db = require('../../db');

var videoSchema = new db.Schema({
    _id: { type: String, unique: false },
    kind: String,
    etag: String,
    title: String,
    description: String,
    tags: [],
    publishedAt: {
        type: Date, default: Date.now
    },
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
});

module.exports = db.model('Videos', videoSchema);