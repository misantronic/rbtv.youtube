import * as Marionette from 'backbone.marionette'
import playlistsController from './modules/playlists/controller'
import breadcrumbController from './modules/breadcrumb/controller'

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.css'

import 'bootstrap-datepicker'
import './overrides/marionette.stickit'
import '../assets/css/application.scss'
import './modules/playlists/router'
import './modules/breadcrumb/router'

class Application extends Marionette.Application {

    get regions() {
        return {
            main: '#region-main',
            breadcrumb: '#region-breadcrumb'
        }
    }

    initialize() {
        this.listenTo(this, 'start', this._onStart);
    }

    navigate(route, options = { trigger: true }) {
        route = route || Backbone.history.getFragment() || 'playlists';

        Backbone.history.navigate(route, options);
    }

    _onStart() {
        breadcrumbController.init(this.getRegion('breadcrumb'));
        playlistsController.init(this.getRegion('main'));

        Backbone.history.start();

        this.navigate();
    }
}

var app = new Application();

export default app;