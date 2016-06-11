import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class Router extends AppRouter {
    get appRoutes() {
        return {
            'overview': 'initOverview'
        };
    }

    get controller() {
        return controller;
    }
}

export default new Router();
