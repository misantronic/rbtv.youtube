import _ from 'underscore';
import {Collection} from 'backbone';
import Config from '../../../Config';
import PlaylistModel from './Playlist';

const defaultResults = 24;

/**
 * @class PlaylistsCollection
 */
const Playlists = Collection.extend({

    model: PlaylistModel,

    comparator: 'title',

    _displayResults: defaultResults,

    url: Config.endpoints.playlists,

    parse(response) {
        return response.items;
    },

    search({ search, rbtv, lp, increaseResults, resetResults }) {
        if (!this._allModels) {
            this._allModels = this.models;
        }

        let models = _.filter(this._allModels, model => {
            const channelId = model.get('channelId');
            const title = model.get('title');

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
        });

        if (increaseResults) {
            this._displayResults += defaultResults;
        }

        if (resetResults) {
            this._displayResults = defaultResults;
        }

        const prevNumModels = this.models.length;

        // Reset collection when not increasing
        if (!increaseResults) {
            this.reset();
        }

        // Add models to collection if:
        // 1. collection is normally filtered
        // 2. number of models is increased while scrolling
        if (!increaseResults || increaseResults && models.length !== prevNumModels) {
            models = _.offset(models, 0, this._displayResults);

            this.add(models);
        }
    },

    filterBy({ search, channelRBTV, channelLP, limit, add }) {
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

            if (!channelRBTV && !channelLP) {
                return false;
            }

            if (channelRBTV && !channelLP && channelId !== Config.channelRBTV) {
                return false;
            }

            if (channelLP && !channelRBTV && channelId !== Config.channelLP) {
                return false;
            }

            return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        this.models = _.offset(models, 0, limit);
    }
});

export default Playlists;
