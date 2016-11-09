import {Collection} from 'backbone';
import SearchResult from './SearchResult';
import Config from '../../../Config';
import $ from 'jquery';

const SearchResults = Collection.extend({
    model: SearchResult,

    _q: '',
    _relatedToVideoId: '',
    _nextPageToken: null,
    _fetchedItems: [],

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

    getFetchedItems() {
        return this._fetchedItems || [];
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

        const items = response.items;

        if (items) {
            if (items.length === 0) {
                this._nextPageToken = null;
            }

            this._fetchedItems = _.map(items, item => new SearchResult(item, { parse: true }));

            return this.models.concat(items);
        }

        this._nextPageToken = null;

        return this.models;
    },

    reset() {
        this._nextPageToken = null;
        this._fetchedItems = null;
        this._channelId = null;
        this._q = null;

        return Collection.prototype.reset.apply(this, arguments);
    }
});

export default SearchResults;
