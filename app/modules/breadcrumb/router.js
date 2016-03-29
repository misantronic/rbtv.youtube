import {AppRouter} from 'backbone.marionette';
import controller from './controller';
import playlistsRouter from '../playlists/router'
import {history} from 'backbone'

class BreadcrumbRouter extends AppRouter {
    initialize() {
        playlistsRouter.on('route', this.onRoute.bind(this))
    }

    /** @type {BreadcrumbController} */
    get controller() {
        return controller
    }

    onRoute() {
        let fragment = history.getFragment();

        if (fragment.indexOf('playlists/playlist/') === 0) {
            this.controller.initPlaylist(fragment.split('/')[2]);
        }

        if (fragment === 'playlists') {
            this.controller.initPlaylists();
        }
    }
}

let breadcrumbRouter = new BreadcrumbRouter();

export default breadcrumbRouter;
