import * as Marionette from 'backbone.marionette';
import ActivitiesColection from './models/Activities';
import ActivitiesLayout from './views/ActivitiesLayout';
import channels from '../../channels';

import './styles/activities.scss';

const ActivitiesController = Marionette.Object.extend({
    init(region) {
        this._region = region;
    },

    initActivities() {
        this._region.show(
            new ActivitiesLayout({ collection: new ActivitiesColection() })
        );

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Übersicht', route: 'activities' });
    },

    initStandaloneActivities() {
        this._region.show(
            new ActivitiesLayout({ 
                collection: new ActivitiesColection(),
                disableSearch: true
            })
        );
    }
});

export default new ActivitiesController();
