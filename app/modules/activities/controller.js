import * as Marionette from 'backbone.marionette'
import ActivitiesColection from './models/Activities'
import ActivitiesView from './views/Activities'

import '../../../assets/css/activities.scss';

class ActivitiesController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initOverview() {
        let activities = new ActivitiesColection();

        let view = new ActivitiesView({ collection: activities });

        this._region.show(view);

        view.renderActivities();
    }
}

export default new ActivitiesController();