import * as Marionette from 'backbone.marionette';
import {history} from 'backbone'
import Config from '../../Config'
import {props} from '../decorators'

class Controller extends Marionette.Object {
    @props({
        Radio: {
            breadcrumb: {
                replace: '_onRoute'
            }
        }
    })

    _onRoute() {
        const route = history.getFragment().split('/')[0];

        Config.navigation.each(function (model) {
            model.set('_active', model.get('route') === route);
        });
    }
}

export default new Controller();
