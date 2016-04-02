import * as Marionette from 'backbone.marionette'
import SearchColection from './models/Search'
import SearchResultsView from './views/SearchResults'

class SearchController extends Marionette.Object {

    initialize() {
        /** @type {SearchResults} */
        this._searchResultsView = null;
    }

    prepareSearch(q) {
        if (!this._searchResultsView) {
            const collection = new SearchColection();

            this._searchResultsView = new SearchResultsView({ collection: collection });
        }

        this._searchResultsView.collection
            .setNextPageToken(null)
            .setQ(q);

        return this._searchResultsView;
    }
}

export default new SearchController();