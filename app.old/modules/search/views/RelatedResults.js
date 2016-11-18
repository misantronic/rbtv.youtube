import {CollectionView} from 'backbone.marionette';
import {PlaylistItem} from '../../playlistsDetails/views/PlistlistItems';

const RelatedResults = CollectionView.extend({
    className: 'playlist-items related-items',

    childView: PlaylistItem

});

export default RelatedResults;
