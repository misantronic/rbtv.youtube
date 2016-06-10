import {CollectionView} from 'backbone.marionette'
import {SearchResult} from '../../search/views/SearchResults'

const ActivitiesCollection = CollectionView.extend({
    childView: SearchResult,

    className: 'activities-items'
});

export default ActivitiesCollection