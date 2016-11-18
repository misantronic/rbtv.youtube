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
        this._showActivities();

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Übersicht', route: 'activities' });
    },

    initStandaloneActivities() {
        this._showActivities({
            disableSearch: true,
            disableBtnToTop: true
        });
    },

    _showActivities(viewOptions = {}) {
        viewOptions = _.extend({ collection: new ActivitiesColection() }, viewOptions);

        this._region.show(
            new ActivitiesLayout(viewOptions)
        );
    }
});

export default new ActivitiesController();
