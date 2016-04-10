import _ from 'underscore'
import * as Marionette from 'backbone.marionette';
import {history} from 'backbone'
import controller from './controller';
import playlistsRouter from '../playlists/router'
import overviewRouter from '../activities/router'
import videoRouter from '../videos/router'

class Router extends Marionette.Object {
    initialize() {
        _.bindAll(this, '_onRoute');

        playlistsRouter.on('route', this._onRoute);
        overviewRouter.on('route', this._onRoute);
        videoRouter.on('route', this._onRoute);
    }

    /** @type {BreadcrumbController} */
    get controller() {
        return controller
    }

    _onRoute() {
        const fragment = history.getFragment();

        if (fragment.indexOf('playlists/playlist/') === 0) {
            this.controller.initPlaylist(fragment.split('/')[2]);
        } else if (fragment.indexOf('video/') === 0) {
            this.controller.initVideo();
        } else if (fragment === 'playlists') {
            this.controller.initPlaylists();
        } else if (fragment === 'overview') {
            this.controller.initOverview();
        }
    }
}

const breadcrumbRouter = new Router();

export default breadcrumbRouter;
