import * as Marionette from 'backbone.marionette'
import $ from 'jquery'
import {Collection, history} from 'backbone'
import BreadcrumbView from './views/Breadcrumb'
import Config from '../../Config'

class BreadcrumbController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId = null;
        
        this._region.show(
            new BreadcrumbView({
                collection: new Collection([
                    { title: 'Playlists' }
                ])
            })
        );
    }

    initPlaylist(playlistId) {
        if(this._currentPlaylistId === playlistId) return;

        // Retrieve playlist-name
        $.get(`${Config.endpoints.playlists}?part=snippet&id=${playlistId}&maxResults=1&fields=items%2Fsnippet%2Ftitle&key=${Config.key}`)
            .done(function (data) {
                let title = data.items[0].snippet.title;

                this._region.show(
                    new BreadcrumbView({
                        collection: new Collection([
                            { title: 'Playlists', route: 'playlists' },
                            { title }
                        ])
                    })
                );
            }.bind(this));

        this._currentPlaylistId = playlistId;
    }
}

export default new BreadcrumbController();