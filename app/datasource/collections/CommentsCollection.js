const Collection = require('backbone').Collection;
const Config = require('../../Config');
const CommentModel = require('./../models/CommentModel');

module.exports = Collection.extend({

    model: CommentModel,

    url() {
        return `${Config.endpoints.comments}?parentId=${this._parentId}&pageToken=${this._pageToken}`;
    },

    _pageToken: '',
    _videoId: '',

    setParentId(val) {
        this._pageToken = '';
        this._parentId = val;
    },

    getPageToken() {
        return this._pageToken;
    },

    parse(response) {
        this._pageToken = response.nextPageToken || '';

        return this.models.concat(response.items);
    }
});
