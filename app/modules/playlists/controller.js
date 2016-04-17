import * as Marionette from 'backbone.marionette'
import PlaylistsCollection from './models/Playlists'
import PlaylistsView from './views/Playlists'
import VideoView from '../videos/views/VideoLayout'
import {Video as VideoModel} from '../videos/models/Videos'
import channels from '../../channels'
import youtubeController from '../youtube/controller'

class PlaylistsController extends Marionette.Object {

    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId = null;

        const collection = new PlaylistsCollection();
        const view       = new PlaylistsView({ collection: collection });

        this._region.show(view);

        view.loading = true;
        
        collection.fetch({ silent: true })
            .done(() => {
                view.renderCollection(true);
            });

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Playlists', route: 'playlists' });
    }

    initPlaylist(playlistId, videoId = null) {
        let view = new VideoView({ model: new VideoModel() });

        this._region.show(view);

        view.model.set({
            id: videoId,
            playlistId: playlistId
        });

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Playlists', route: 'playlists' });

        youtubeController.fetchPlaylistName(playlistId)
            .done(title => {
                channels.breadcrumb.push({ title });
            });
    }
}

export default new PlaylistsController();