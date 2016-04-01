import * as Marionette from 'backbone.marionette'
import SearchColection from './models/Search'
import SearchView from './views/Search'

class SearchController extends Marionette.Object {

    initialize() {
        /** @type {SearchView} */
        this._view = null;
    }

    prepareSearch(q) {
        if (!this._view) {
            const collection = new SearchColection();

            this._view = new SearchView({ collection: collection });
        }

        this._view.collection
            .setNextPageToken(null)
            .setQ(q);

        return this._view;
    }
}

export default new SearchController();