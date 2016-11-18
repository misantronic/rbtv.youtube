import {CollectionView} from 'backbone.marionette';
import Show from './Show';

const ShowsList = CollectionView.extend({
    childView: Show,

    className: 'shows-items items row'
});

export default ShowsList;
