const _ = require('underscore');
const $ = require('jquery');
const Collection = require('backbone').Collection;
const Config = require('../../Config');
const PlaylistModel = require('./../models/PlaylistModel');

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
        this._allModels = null;

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

    filterBy({ search, channels, limit, add }) {
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

            if (!_.contains(channels, channelId)) return false;

            return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        // this.models = _.offset(models, 0, limit);
        this.reset(_.offset(models, 0, limit));

        if (add) {
            this.trigger('sync');
        }
    }
});

module.exports = Playlists;
