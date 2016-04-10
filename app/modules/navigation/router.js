import * as Marionette from 'backbone.marionette';
import playlistsRouter from '../playlists/router'
import overviewRouter from '../activities/router'
import {history} from 'backbone'
import Config from '../../Config'

class Router extends Marionette.Object {
    initialize() {
        playlistsRouter.on('route', this._onRoute.bind(this));
        overviewRouter.on('route', this._onRoute.bind(this));
    }

    _onRoute() {
        const route = history.getFragment().split('/')[0];

        Config.navigation.each(function (model) {
            model.set('_active', model.get('route') === route);
        });
    }
}

const router = new Router();

export default router;
