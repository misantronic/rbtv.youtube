import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class Router extends AppRouter {
    get appRoutes() {
        return {
            shows: 'initShows'
        };
    }

    get controller() {
        return controller;
    }
}

export default new Router();
