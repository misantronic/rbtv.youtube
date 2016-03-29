import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import {localStorage} from '../../../utils';
import Config from '../../../Config';

const parts      = 'snippet, contentDetails';
const maxResults = 50;

class PlaylistItem extends Model {

    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            videoId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        }
    }

    /** @param {{kind: string, etag: string, id: string, snippet: {publishedAt: string, channelId: string, title: string, description: string, thumbnails: {default: {url: string, width: number, height: number}, medium: {url: string, width: number, height: number}, high: {url: string, width: number, height: number}, standard: {url: string, width: number, height: number}, maxres: {url: string, width: number, height: number}}, channelTitle: string, playlistId: string, position: number, resourceId: {kind: string, videoId: string}}, contentDetails: {videoId: string}}} response */
    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            videoId: response.contentDetails.videoId,
            playlistId: response.snippet.playlistId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        }
    }
}

class PlaylistItems extends Collection {
    constructor(...args) {
        super(...args);

        this.model = PlaylistItem;

        this._originalModels = [];
    }

    static get urlRoot() {
        return 'https://www.googleapis.com/youtube/v3/playlistItems';
    }

    set playlistId(val) {
        this._playlistId = val;
        this._Deferred   = null;
    }

    url() {
        return Config.endpoints.playlistItems + '?' + $.param([
                { name: 'part', value: parts },
                { name: 'maxResults', value: maxResults },
                { name: 'key', value: Config.key },
                { name: 'playlistId', value: this._playlistId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    fetch(...args) {
        if (!this._Deferred) {
            this._Deferred = $.Deferred();
        }

        // Cache
        let models = localStorage.get(this._playlistId);

        if (models) {
            this.reset(models);

            this._fetchComplete();
        } else {
            Collection.prototype.fetch.apply(this, ...args);
        }

        return this._Deferred.promise();
    }

    parse(response) {
        this._nextPageToken = null;

        if (response.nextPageToken) {
            this._nextPageToken = response.nextPageToken;

            this.fetch();
        } else {
            this._fetchComplete();
        }

        return this.models.concat(response.items);
    }

    search({ search }) {
        this.reset(
            _.filter(this._originalModels, function (model) {
                let title = model.get('title');

                return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })
        )
    }

    /** @private */
    _fetchComplete() {
        // Cache
        _.defer(function () {
            localStorage.set(this._playlistId, this.toJSON());

            this._Deferred.resolve(this);
        }.bind(this));

        this._originalModels = this.models;
    }
}

export {PlaylistItem, PlaylistItems}
export default PlaylistItems