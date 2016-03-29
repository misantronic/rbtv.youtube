import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class PlaylistsRouter extends AppRouter {
    get appRoutes() {
        return {
            'playlists': 'initPlaylists',
            'playlists/playlist/:id': 'initPlaylist',
            'playlists/playlist/:id/video/:videoId': 'initPlaylist'
        }
    }

    get controller() {
        return controller
    }
}

let playlistsRouter = new PlaylistsRouter();

export default playlistsRouter;
