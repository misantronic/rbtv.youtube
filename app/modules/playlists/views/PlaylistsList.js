import {CollectionView} from 'backbone.marionette'
import {Playlist, PlaylistEmpty} from './PlaylistItem'

const PlaylistsList = CollectionView.extend({
    className: 'items items-playlists row',

    childView: Playlist,

    emptyView: PlaylistEmpty
});

export default PlaylistsList