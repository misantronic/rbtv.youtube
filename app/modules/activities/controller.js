import * as Marionette from 'backbone.marionette'
import ActivitiesColection from './models/Activities'
import ActivitiesLayout from './views/ActivitiesLayout'
import channels from '../../channels'

import '../../../assets/css/modules/activities.scss';

class ActivitiesController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initOverview() {
        this._region.show(
            new ActivitiesLayout({ collection: new ActivitiesColection() })
        );

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Übersicht', route: 'overview' });
    }
}

export default new ActivitiesController();