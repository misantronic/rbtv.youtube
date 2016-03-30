import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class VideosRouter extends AppRouter {
    get appRoutes() {
        return {
            'videos': 'initVideos'
        }
    }

    get controller() {
        return controller
    }
}

const router = new VideosRouter();

export default router;
