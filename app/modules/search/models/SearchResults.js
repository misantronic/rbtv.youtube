import {Model, Collection} from 'backbone'
import Config from '../../../Config'
import $ from 'jquery'
import moment from 'moment'

const parts      = 'snippet';
const maxResults = 30;
const order      = 'date';
const type       = 'video';

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

    get nextPageToken() {
        return this._nextPageToken
    }

    url() {
        return Config.endpoints.search + '?' + $.param([
                { name: 'part', value: parts },
                { name: 'maxResults', value: maxResults },
                { name: 'key', value: Config.key },
                { name: 'channelId', value: this._channelId },
                { name: 'q', value: this._q },
                { name: 'order', value: order },
                { name: 'type', value: type },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    parse(response) {
        this._nextPageToken = response.nextPageToken;

        if(response.items.length === 0) {
            this._nextPageToken = null;
        }

        return this.models.concat(response.items)
    }
}

export default SearchResults