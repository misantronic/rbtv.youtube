const Collection = require('backbone').Collection;
const Config = require('../../Config');
const CommentThreadModel = require('./../models/CommentTreadModel');

module.exports = Collection.extend({

    model: CommentThreadModel,

    _pageToken: '',
    _videoId: '',

    url() {
        return `${Config.endpoints.commentThreads}?videoId=${this._videoId}&pageToken=${this._pageToken}`;
    },

    setVideoId(val) {
        this._pageToken = '';
        this._videoId = val;
    },

    getPageToken() {
        return this._pageToken;
    },

    parse(response) {
        this._pageToken = response.nextPageToken || null;

        return this.models.concat(response.items);
    }
});
