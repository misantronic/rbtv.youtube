import * as Marionette from 'backbone.marionette'
import PlaylistsCollection from './models/Playlists'
import PlaylistsLayout from './views/PlaylistsLayout'
import VideoLayout from '../videos/views/VideoLayout'
import {Video as VideoModel} from '../videos/models/Videos'
import channels from '../../channels'
import youtubeController from '../youtube/controller'
import PlaylistItemsCollection from '../playlistsDetails/models/PlaylistItems'

import '../../../assets/css/modules/playlists.scss';

class PlaylistsController extends Marionette.Object {

    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId = null;

        const collection = new PlaylistsCollection();
        const view = new PlaylistsLayout({ collection });

        this._region.show(view);

        view.startLoading();

        collection.fetch({ silent: true })
            .done(() => {
                view.renderCollection(true);
            });

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Playlists', route: 'playlists' });
    }

    initPlaylist(playlistId, videoId = null) {
        this._fetchPlaylistItems(playlistId)
            .done(collection => {
                const model = new VideoModel();

                this._region.show(
                    new VideoLayout({
                        model,
                        collection
                    })
                );

                model.set({
                    id: videoId,
                    playlistId: playlistId
                });

                // Update breadcrumb
                channels.breadcrumb.replace({ title: 'Playlists', route: 'playlists' });

                youtubeController.fetchPlaylistName(playlistId)
                    .done(title => {
                        channels.breadcrumb.push({ title });
                    });
            });
    }

    _fetchPlaylistItems(playlistId) {
        const collection = new PlaylistItemsCollection();

        collection.playlistId = playlistId;

        return collection.fetch();
    }
}

export default new PlaylistsController();