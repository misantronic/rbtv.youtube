import * as Marionette from 'backbone.marionette'
import {Collection} from 'backbone'
import BreadcrumbView from './views/Breadcrumb'
import channels from '../../channels'

class BreadcrumbController extends Marionette.Object {
    init(region) {
        this._region = region;

        this.listenTo(channels.breadcrumb, 'replace', this._onReplace);
        this.listenTo(channels.breadcrumb, 'push', this._onPush);
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
        if(!this.collection) {
            this._initColletion();
        }

        this.collection.reset(routes);
    }

    _onPush(...routes) {
        if(!this.collection) {
            this._initColletion();
        }

        this.collection.add(routes);
    }
}

export default new BreadcrumbController();