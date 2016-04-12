import * as Marionette from 'backbone.marionette'
import ActivitiesColection from './models/Activities'
import ActivitiesView from './views/Activities'
import channels from '../../channels'

import '../../../assets/css/activities.scss';

class ActivitiesController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initOverview() {
        let view = new ActivitiesView({ collection: new ActivitiesColection() });

        this._region.show(view);

        view.renderActivities();

        // Update breadcrumb
        channels.breadcrumb.replace('Übersicht', 'overview');
    }
}

export default new ActivitiesController();