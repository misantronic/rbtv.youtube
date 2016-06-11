import * as Marionette from 'backbone.marionette';
import _ from 'underscore';
import {Collection} from 'backbone';
import BreadcrumbView from './views/Breadcrumb';
import {props} from '../decorators';

import './styles/breadcrumb.scss';

class BreadcrumbController extends Marionette.Object {
    @props({
        channels: {
            breadcrumb: {
                replace: '_onReplace',
                push: '_onPush'
            }
        }
    })

    init(region) {
        this._region = region;
    }

    _initColletion() {
        this.collection = new Collection();

        this._region.show(
            new BreadcrumbView({
                collection: this.collection
            })
        );
    }

    _onReplace(...routes) {
        if (!this.collection) {
            this._initColletion();
        }

        this.collection.reset(routes);
    }

    _onPush(...routes) {
        if (!this.collection) {
            this._initColletion();
        }

        _.each(routes, route => {
            if (route.type) {
                const model = this.collection.findWhere({type: route.type});

                this.collection.remove(model);
            }

            this.collection.add(route);
        });
    }
}

export default new BreadcrumbController();
