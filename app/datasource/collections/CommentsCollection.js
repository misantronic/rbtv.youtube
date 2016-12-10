const Collection = require('backbone').Collection;
import Config from '../../Config';
import CommentModel from './../models/CommentModel';

module.exports = Collection.extend({

    model: CommentModel,

    url() {
        return `${Config.endpoints.comments}?parentId=${this._parentId}&pageToken=${this._nextPageToken}`;
    },

    _nextPageToken: '',
    _videoId: '',

    setParentId(val) {
        this._nextPageToken = '';
        this._parentId = val;
    },

    getPageToken() {
        return this._nextPageToken;
    },

    parse(response) {
        this._nextPageToken = response.nextPageToken || '';

        return this.models.concat(response.items);
    }
});
