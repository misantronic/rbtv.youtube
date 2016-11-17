import _ from 'underscore';
import $ from 'jquery';
import {Collection} from 'backbone';
import Config from '../Config';
import PlaylistModel from './PlaylistModel';

const defaultResults = 24;

/**
 * @class PlaylistsCollection
 */
const Playlists = Collection.extend({

    model: PlaylistModel,

    comparator: 'title',

    _playlistIds: [],
    _displayResults: defaultResults,

    url() {
        let param = '';

        if (this._playlistIds.length) {
            param = '?' +
                $.param([
                    { name: 'id', value: this._playlistIds.join(',') }
                ]);
        }

        return Config.endpoints.playlists + param;
    },

    parse(response) {
        return response.items;
    },

    clone() {
        const cloned = Collection.prototype.clone.call(this);

        // Copy props
        cloned._playlistIds = this._playlistIds.slice(0);

        return cloned;
    },

    /**
     * @param {Array} val
     * @returns {Videos}
     */
    setPlaylistIds(val) {
        this._playlistIds = val;

        return this;
    },

    filterBy({ search, channelRBTV, channelLP, channelG2, limit, add }) {
        if (!this._allModels) {
            this._allModels = this.models;
        }

        if (!this._limit) {
            this._limit = 0;
        }

        if (add) {
            limit += this._limit;

            this._limit = limit;
        } else {
            this._limit = 0;
        }

        const models = _.filter(this._allModels, model => {
            const channelId = model.get('channelId');
            const title = model.get('title');

            if (!channelRBTV && !channelLP && !channelG2) {
                return false;
            }

            if (channelRBTV && !channelLP && !channelG2 && channelId !== Config.channelRBTV) {
                return false;
            }

            if (channelLP && !channelRBTV && !channelG2 && channelId !== Config.channelLP) {
                return false;
            }

            if (channelG2 && !channelRBTV && !channelLP && channelId !== Config.channelG2) {
                return false;
            }

            return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        this.models = _.offset(models, 0, limit);

        if (add) {
            this.trigger('sync');
        }
    }
});

module.exports = Playlists;
