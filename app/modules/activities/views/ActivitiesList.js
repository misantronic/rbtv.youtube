import {CollectionView} from 'backbone.marionette';
import SearchResult from '../../search/views/SearchResult';

const ActivitiesCollection = CollectionView.extend({
    childView: SearchResult,

    className: 'activities-items items row'
});

export default ActivitiesCollection;
