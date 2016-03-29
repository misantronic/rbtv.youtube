import * as Marionette from 'backbone.marionette';
import PlaylistsCollection from './models/Playlists';
import PlaylistItemsCollection from './models/PlaylistItems';
import PlaylistsView from './views/Playlists';
import PlaylistItemsView from './views/PlistlistItems';
import Config from '../../Config';
import app from '../../application';

import '../../../assets/css/playlists.scss';

class PlaylistsController extends Marionette.Object {

    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId  = null;
        this._playlistCollection = new PlaylistsCollection();

        this._fetchPlaylist(Config.channelRBTV)
            .done(function () {
                this._fetchPlaylist(Config.channelLP)
                    .done(this._onPlaylistsLoaded.bind(this))
            }.bind(this))
    }

    initPlaylist(playlistId, videoId = null) {
        if (playlistId === this._currentPlaylistId) {
            return this._initVideo(videoId);
        }

        this._playlistItemsCollection = new PlaylistItemsCollection();

        this._playlistItemsCollection.playlistId = playlistId;

        this._currentPlaylistId = playlistId;

        this._playlistItemsCollection
            .fetch()
            .then(this._onPlaylistItemsLoaded.bind(this))
            .then(this._initVideo.bind(this, videoId));
    }

    _initVideo(videoId) {
        if (!videoId) {
            let playlistItem = this._playlistItemsCollection.first();

            if (playlistItem) {
                videoId = playlistItem.get('videoId');

                app.navigate(`playlists/playlist/${this._currentPlaylistId}/video/${videoId}`);
            }
        }

        if (_.isNull(videoId) || !this._playlistItemsView) return;

        this._playlistItemsView.videoId = videoId;
    }

    /** @private */
    _fetchPlaylist(channelId) {
        this._playlistCollection.channelId = channelId;

        return this._playlistCollection.fetch();
    }

    /** @private */
    _onPlaylistsLoaded() {
        this._playlistView = new PlaylistsView({ collection: this._playlistCollection });

        this._region.show(this._playlistView);
    }

    /** @private */
    _onPlaylistItemsLoaded() {
        this._playlistItemsView = new PlaylistItemsView({ collection: this._playlistItemsCollection });

        this._region.show(this._playlistItemsView);
    }
}

export default new PlaylistsController();