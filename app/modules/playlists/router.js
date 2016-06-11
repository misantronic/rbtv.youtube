import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class Router extends AppRouter {
    get appRoutes() {
        return {
            'playlists': 'initPlaylists',
            'playlists/playlist/:id': 'initPlaylist',
            'playlists/playlist/:id/video/:videoId': 'initPlaylist'
        };
    }

    get controller() {
        return controller;
    }
}

const router = new Router();

export default router;
