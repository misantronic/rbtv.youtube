import $ from 'jquery'
import * as Marionette from 'backbone.marionette'
import PlaylistsCollection from './models/Playlists'
import PlaylistItemsCollection from './models/PlaylistItems'
import PlaylistsView from './views/Playlists'
import PlaylistItemsView from './views/PlistlistItems'
import Config from '../../Config'
import channels from '../../channels'

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

        // Check cache for playlists
        collection.fetch({ silent: true })
            .done(() => {
                view.renderCollection(true);
            });

        // Update breadcrumb
        channels.breadcrumb.trigger('replace', { title: 'Playlists', route: 'playlists' });
    }

    initPlaylist(playlistId, videoId = null) {
        if (!_.isNull(playlistId) && playlistId === this._currentPlaylistId) {
            return this._initVideo(videoId);
        }

        let collection = new PlaylistItemsCollection();
        let view       = new PlaylistItemsView({ collection });

        this._currentPlaylistId = collection.playlistId = playlistId;

        this._region.show(view);

        view.loading = true;

        // Check cache for playlistItems
        collection.fetch()
            .done(() => {
                view.loading = false;

                this._initVideo(videoId);
            });

        this._playlistItemsCollection = collection;
        this._playlistItemsView       = view;

        // Update breadcrumb
        channels.breadcrumb.replace('Playlists', 'playlists');

        this._fetchPlaylistName(playlistId).done(title => {
            channels.breadcrumb.push(title);
        });
    }

    _initVideo(videoId) {
        if (!videoId) {
            this._playlistItemsView.videoId = null;

            const playlistItem = this._playlistItemsCollection.first();

            if (playlistItem) {
                videoId = playlistItem.get('videoId');

                // Workaround: Pre-Select first item in playlist
                // without affecting the users back-button-history
                this._playlistItemsView.model.set('videoId', videoId, { silent: true });
                this._playlistItemsView._highlightVideo();
                this._playlistItemsView._routeToVideo(true);
                this._playlistItemsView._videoInit();

                return;
            }
        }

        this._playlistItemsView.videoId = videoId;
    }

    _fetchPlaylistName(playlistId) {
        return $.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&maxResults=1&fields=items%2Fsnippet%2Ftitle&key=${Config.key}`)
            .then((data) => {
                return data.items[0]['snippet'].title
            });
    }
}

export default new PlaylistsController();