import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import {sessionStorage} from '../../../utils';
import Config from '../../../Config';

const parts      = 'snippet, contentDetails';
const maxResults = 50;

class Playlist extends Model {
    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            itemCount: 0,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        }
    }

    /** @param {{kind: string, etag: string, id: string, snippet: {publishedAt: string, channelId: string, title: string, description: string, thumbnails: {default: {url: string, width: number, height: number}, medium: {url: string, width: number, height: number}, high: {url: string, width: number, height: number}, standard: {url: string, width: number, height: number}, maxres: {url: string, width: number, height: number}}, channelTitle: string, localized: {title: string, description: string}}, contentDetails: {itemCount: number}}} response      */
    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            itemCount: response.contentDetails.itemCount,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
}

/**
 * @class PlaylistsCollection
 */
class Playlists extends Collection {

    constructor(...args) {
        super(...args);

        this.model = Playlist;

        this._originalModels = [];
    }

    get comparator() {
        return 'title';
    }

    set channelId(val) {
        this._channelId = val;
        this._Deferred  = null;
    }

    url() {
        return Config.endpoints.playlists + '?' + $.param([
                { name: 'part', value: parts },
                { name: 'maxResults', value: maxResults },
                { name: 'key', value: Config.key },
                { name: 'channelId', value: this._channelId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    fetch(...args) {
        if (!this._Deferred) {
            this._Deferred = $.Deferred();
        }

        // Cache
        let models = sessionStorage.get(this._channelId);

        if (models) {
            this.reset(models);

            this._fetchComplete();
        } else {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register(this.url()).then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
                }).catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
            }

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

    search({ search, rbtv, lp }) {
        this.reset(
            _.filter(this._originalModels, function (model) {
                let channelId = model.get('channelId');
                let title     = model.get('title');

                if (!rbtv && !lp) {
                    return false;
                }

                if (rbtv && !lp && channelId !== Config.channelRBTV) {
                    return false;
                }

                if (lp && !rbtv && channelId !== Config.channelLP) {
                    return false;
                }

                return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })
        )
    }

    /** @private */
    _fetchComplete() {
        // Cache
        _.defer(function () {
            sessionStorage.set(this._channelId, this.toJSON());

            this._Deferred.resolve(this);
        }.bind(this));

        this._originalModels = this.models;
    }

}

export {Playlist, Playlists}
export default Playlists