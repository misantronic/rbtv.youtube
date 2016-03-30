import {AppRouter} from 'backbone.marionette';
import controller from './controller';

class OverviewRouter extends AppRouter {
    get appRoutes() {
        return {
            'overview': 'initOverview'
        }
    }

    get controller() {
        return controller
    }
}

const router = new OverviewRouter();

export default router;
