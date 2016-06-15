import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class Router extends AppRouter {
    get appRoutes() {
        return {
            'activities': 'initActivities',
            'standalone/activities': 'initStandaloneActivities'
        };
    }

    get controller() {
        return controller;
    }
}

export default new Router();
