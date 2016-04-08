import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import Config from '../../../Config';
import {props} from '../../decorators'

const defaultResults = 24;

class Playlist extends Model {
    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            itemCount: 0,
            channelId: null,
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

    @props({
        model: Playlist,

        comparator: 'title',

        _displayResults: defaultResults,

        url: Config.endpoints.playlists
    })

    parse(response) {
        return response.items;
    }

    search({ search, rbtv, lp, increaseResults, resetResults }) {
        if(!this._allModels) {
            this._allModels = this.models;
        }

        let models = _.filter(this._allModels, (model) => {
            const channelId = model.get('channelId');
            const title     = model.get('title');

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

        let prevNumModels = this.models.length;

        models = _.offset(models, 0, this._displayResults);

        // Reset collection only if:
        // 1. collection is normally filtered
        // 2. number of models is increased while scrolling
        if (!increaseResults || (increaseResults && models.length !== prevNumModels)) {
            this.reset(models);
        }
    }

}

export {Playlist, Playlists}
export default Playlists