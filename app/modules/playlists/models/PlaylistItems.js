import _ from 'underscore';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import Config from '../../../Config';
import {props} from '../../decorators'

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
            videoId: response.snippet.resourceId.videoId,
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
    @props({
        model: PlaylistItem,

        url: function () {
            return Config.endpoints.playlistItems +'?playlistId='+ this._playlistId;
        }
    })

    set playlistId(val) {
        this._playlistId = val;
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

    parse(response) {
        return response.items;
    }

    search({ search, date }) {
        if(!this._allModels) {
            this._allModels = this.models;
        }

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
}

export {PlaylistItem, PlaylistItems}
export default PlaylistItems