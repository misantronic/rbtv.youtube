import {Model, Collection} from 'backbone'
import Config from '../../../Config'
import $ from 'jquery'
import moment from 'moment'

class SearchResult extends Model {
    defaults() {
        return {
            id: null,
            etag: null,
            kind: null,
            videoId: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        }
    }

    parse(response) {
        return {
            id: response.id.videoId,
            etag: response.etag,
            kind: response.id.kind,
            videoId: response.id.videoId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
}

class SearchResults extends Collection {
    constructor(...args) {
        super(...args);

        this.model = SearchResult;

        this._q                = '';
        this._relatedToVideoId = '';
    }

    /** @returns {PlaylistItem} */
    getNextPlaylistItem(videoId) {
        const model = this.getCurrentPlaylistItem(videoId);
        const index = this.indexOf(model) + 1;

        return this.at(index);
    }

    /** @returns {PlaylistItem} */
    getCurrentPlaylistItem(videoId) {
        return this.findWhere({ videoId });
    }

    setChannelId(val) {
        this._channelId = val;

        return this
    }

    setNextPageToken(val) {
        this._nextPageToken = val;

        return this
    }

    setQ(val) {
        this._q = val;

        return this;
    }

    setRelatedToVideoId(val) {
        this._relatedToVideoId = val;

        return this;
    }

    get nextPageToken() {
        return this._nextPageToken
    }

    url() {
        return Config.endpoints.search + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'q', value: this._q },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    parse(response) {
        this._nextPageToken = response.nextPageToken;

        if (response.items) {
            if (response.items.length === 0) {
                this._nextPageToken = null;
            }

            return this.models.concat(response.items)
        }

        this._nextPageToken = null;
    }
}

export {SearchResult, SearchResults}
export default SearchResults