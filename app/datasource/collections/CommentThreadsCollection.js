import {Collection} from 'backbone';
import Config from '../../Config';
import CommentThreadModel from './../models/CommentTreadModel';

module.exports = Collection.extend({

    model: CommentThreadModel,

    _nextPageToken: '',
    _videoId: '',

    url() {
        return `${Config.endpoints.commentThreads}?videoId=${this._videoId}&pageToken=${this._nextPageToken}`;
    },

    setVideoId(val) {
        this._nextPageToken = '';
        this._videoId = val;
    },

    getPageToken() {
        return this._nextPageToken;
    },

    parse(response) {
        this._nextPageToken = response.nextPageToken || null;

        return this.models.concat(response.items);
    }
});
