import * as Marionette from 'backbone.marionette'
import $ from 'jquery'
import {Collection} from 'backbone'
import BreadcrumbView from './views/Breadcrumb'
import Config from '../../Config'
import {sessionStorage} from '../../utils'

class BreadcrumbController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId = null;

        this._showBreadcrumb([
            { title: Config.navigation.findWhere({ route: 'playlists' }).get('title') }
        ]);
    }

    initPlaylist(playlistId) {
        // Cache
        let title = sessionStorage.get(`${playlistId}.info`, 'title');

        if (title) {
            return this._showBreadcrumb([
                { title: Config.navigation.findWhere({ route: 'playlists' }).get('title'), route: 'playlists' },
                { title }
            ]);
        }

        if (this._currentPlaylistId === playlistId) return;

        // Retrieve playlist-name
        $.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&maxResults=1&fields=items%2Fsnippet%2Ftitle&key=${Config.key}`)
            .done((data) => {
                const title = data.items[0]['snippet'].title;

                // Cache
                sessionStorage.set(`${playlistId}.info`, { title });

                this._showBreadcrumb([
                    { title: 'Playlists', route: 'playlists' },
                    { title }
                ]);
            });

        this._currentPlaylistId = playlistId;
    }

    initOverview() {
        this._showBreadcrumb([
            { title: Config.navigation.findWhere({ route: 'overview' }).get('title') }
        ]);
    }

    _showBreadcrumb(list) {
        this._region.show(
            new BreadcrumbView({
                collection: new Collection(list)
            })
        );
    }
}

export default new BreadcrumbController();