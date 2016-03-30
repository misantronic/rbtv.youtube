import * as Marionette from 'backbone.marionette'

import '../../../assets/css/overview.scss';

class OverviewController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initOverview() {
        this._region.empty();
    }
}

export default new OverviewController();