import {CollectionView} from 'backbone.marionette';
import {Playlist, PlaylistEmpty} from './Playlist';

const PlaylistsList = CollectionView.extend({
    className: 'items items-playlists row',

    childView: Playlist,

    emptyView: PlaylistEmpty
});

export default PlaylistsList;
