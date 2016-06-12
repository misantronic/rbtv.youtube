import {Collection} from 'backbone';
import SearchResult from './SearchResult';
import Config from '../../../Config';
import $ from 'jquery';

const SearchResults = Collection.extend({
    constructor(...args) {
        Collection.apply(this, args);

        this.model = SearchResult;

        this._q                = '';
        this._relatedToVideoId = '';
    },

    /** @returns {PlaylistItem} */
    getNextPlaylistItem(videoId) {
        const model = this.getCurrentPlaylistItem(videoId);
        const index = this.indexOf(model) + 1;

        return this.at(index);
    },

    /** @returns {PlaylistItem} */
    getCurrentPlaylistItem(videoId) {
        return this.findWhere({ videoId });
    },

    setChannelId(val) {
        this._channelId = val;

        return this;
    },

    setNextPageToken(val) {
        this._nextPageToken = val;

        return this;
    },

    setQ(val) {
        this._q = val;

        return this;
    },

    setRelatedToVideoId(val) {
        this._relatedToVideoId = val;

        return this;
    },

    getNextPageToken() {
        return this._nextPageToken;
    },

    url() {
        return Config.endpoints.search + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'q', value: this._q },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    },

    parse(response) {
        this._nextPageToken = response.nextPageToken;

        if (response.items) {
            if (response.items.length === 0) {
                this._nextPageToken = null;
            }

            return this.models.concat(response.items);
        }

        this._nextPageToken = null;

        return this.models;
    }
});

export default SearchResults;
