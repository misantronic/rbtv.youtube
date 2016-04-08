import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import {sessionStorage} from '../../../utils';
import Config from '../../../Config';

const parts      = 'snippet, contentDetails';
const maxResults = 50;

/**
 * @class PlaylistItemModel
 */
class PlaylistItem extends Model {

    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            videoId: null,
            playlistId: null,
            channelId: null,
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

        this._allModels = [];
    }

    static get urlRoot() {
        return 'https://www.googleapis.com/youtube/v3/playlistItems';
    }

    set playlistId(val) {
        this._playlistId = val;
        this._Deferred   = null;
    }

    set allModels(val) {
        this._allModels = val;

        this.reset(this._allModels);
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

    url() {
        return Config.endpoints.playlistItems + '?' + $.param([
                { name: 'part', value: parts },
                { name: 'maxResults', value: maxResults },
                { name: 'playlistId', value: this._playlistId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    fetch(...args) {
        this._Deferred = this._Deferred || $.Deferred();

        super.fetch.apply(this, ...args);

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

    search({ search, date }) {
        this.reset(
            _.filter(this._allModels, (model) => {
                const title = model.get('title');

                if (date) {
                    const publishedAt = model.get('publishedAt');

                    // Match date
                    if (date.date() !== publishedAt.date() || date.month() !== publishedAt.month() || date.year() !== publishedAt.year()) {
                        return false;
                    }
                }

                return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })
        )
    }

    merge() {
        return $.ajax({
            url: Config.endpoints.mergePlaylistItems +'?playlistId='+ this._playlistId,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(this._allModels)
        })
    }

    /** @private */
    _fetchComplete() {
        _.defer(() => {
            this._Deferred.resolve(this);
        });

        this._allModels = this.models;
    }
}

export {PlaylistItem, PlaylistItems}
export default PlaylistItems