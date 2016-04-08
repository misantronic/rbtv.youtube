import $ from 'jquery'
import * as Marionette from 'backbone.marionette'
import PlaylistsCollection from './models/Playlists'
import PlaylistItemsCollection from './models/PlaylistItems'
import PlaylistsView from './views/Playlists'
import PlaylistItemsView from './views/PlistlistItems'
import Config from '../../Config'

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

        $.getJSON(Config.endpoints.playlists)
            .done((collectionData) => {
                if(!collectionData) {
                    this._fetchPlaylists(collection, Config.channelRBTV, Config.channelLP)
                        .done(() => {
                            view.renderCollection(true);
                        });
                } else {
                    // Apply cached collectionData to collection
                    collection.allModels = new PlaylistsCollection(collectionData).models;

                    view.renderCollection(true);
                }
            });
    }

    initPlaylist(playlistId, videoId = null) {
        if (playlistId === this._currentPlaylistId) {
            return this._initVideo(videoId);
        }

        this._playlistItemsCollection = new PlaylistItemsCollection();

        this._playlistItemsCollection.playlistId = playlistId;

        this._currentPlaylistId = playlistId;

        $.getJSON(Config.endpoints.playlistItems +'?playlistId='+ playlistId)
            .done((collectionData) => {
                if(!collectionData) {
                    this._playlistItemsCollection
                        .fetch()
                        .then(() => {
                            this._playlistItemsView = new PlaylistItemsView({ collection: this._playlistItemsCollection });

                            this._region.show(this._playlistItemsView);

                            this._playlistItemsCollection.merge();
                        })
                        .then(this._initVideo.bind(this, videoId));
                } else {
                    // Apply cached collectionData to collection
                    this._playlistItemsCollection.allModels = new PlaylistItemsCollection(collectionData).models;

                    this._playlistItemsView = new PlaylistItemsView({ collection: this._playlistItemsCollection });

                    this._region.show(this._playlistItemsView);

                    this._initVideo(videoId);
                }
            });
    }

    _initVideo(videoId) {
        if (!videoId) {
            const playlistItem = this._playlistItemsCollection.first();

            if (playlistItem) {
                videoId = playlistItem.get('videoId');

                // Workaround: Pre-Select first item in playlist
                // without affecting the users back-button-history
                this._playlistItemsView.model.set('videoId', videoId, { silent: true });
                this._playlistItemsView._highlightVideo();
                this._playlistItemsView._routeToVideo(true);

                return;
            }
        }

        this._playlistItemsView.videoId = videoId;
    }

    /**
     *
     * @param {PlaylistsCollection} collection
     * @param {Array} channels
     * @returns {Promise}
     * @private
     */
    _fetchPlaylists(collection, ...channels) {
        let i          = 0;
        const Deferred = $.Deferred();

        const _fetchPlaylist = (channelId) => {
            if (!channelId) {
                // resolve promise
                Deferred.resolve(collection);

                collection.merge();

                return;
            }

            collection
                .setChannelId(channelId)
                .fetch()
                .done(() => {
                    i++;

                    _fetchPlaylist(channels[i]);
                });
        };

        _fetchPlaylist(channels[i]);

        return Deferred.promise();
    }
}

export default new PlaylistsController();