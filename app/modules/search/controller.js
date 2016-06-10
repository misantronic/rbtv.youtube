import * as Marionette from 'backbone.marionette'
import SearchResults from './models/SearchResults'
import SearchResultsView from './views/SearchResults'

class SearchController extends Marionette.Object {

    initialize() {
        /** @type {SearchResultsView} */
        this._searchResultsView = null;
    }

    prepareSearch(q) {
        if (!this._searchResultsView) {
            const collection = new SearchResults();

            this._searchResultsView = new SearchResultsView({ collection });
        }

        this._searchResultsView.collection
            .setNextPageToken(null)
            .setQ(q);

        return this._searchResultsView;
    }
}

export default new SearchController();