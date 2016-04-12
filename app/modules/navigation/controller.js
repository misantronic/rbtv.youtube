import * as Marionette from 'backbone.marionette';
import {history} from 'backbone'
import Config from '../../Config'
import channels from '../../channels'

class Controller extends Marionette.Object {
    initialize() {
        this.listenTo(channels.breadcrumb, 'replace', this._onRoute);
    }

    _onRoute() {
        const route = history.getFragment().split('/')[0];

        Config.navigation.each(function (model) {
            model.set('_active', model.get('route') === route);
        });
    }
}

export default new Controller();
