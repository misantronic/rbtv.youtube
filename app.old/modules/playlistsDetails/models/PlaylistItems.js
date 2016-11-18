import _ from 'underscore';
import {Collection} from 'backbone';
import Config from '../../../Config';
import PlaylistItemModel from './PlaylistItem';

const PlaylistItems = Collection.extend({

    model: PlaylistItemModel,

    url() {
        return Config.endpoints.playlistItems + '?playlistId=' + this._playlistId;
    },

    setPlaylistId(val) {
        this._playlistId = val;
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

    clone() {
        const cloned = Collection.prototype.clone.call(this);

        // Copy props
        cloned._playlistId = this._playlistId;

        return cloned;
    },

    parse(response) {
        return response.items;
    },

    search({ search, date }) {
        if (!this._allModels) {
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
        );
    }
});

export default PlaylistItems;
