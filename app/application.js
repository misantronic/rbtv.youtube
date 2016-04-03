import {Application} from 'backbone.marionette'
import {history} from 'backbone'

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.css'
import '../assets/css/application.scss'
import '../assets/css/playlists.scss';

// Modules & overrides
import '../node_modules/moment/locale/de'
import 'bootstrap-datepicker'
import './overrides/marionette.stickit'
import './overrides/marionette.js'
import './overrides/underscore'

// Controller
import playlistsController from './modules/playlists/controller'
import breadcrumbController from './modules/breadcrumb/controller'
import overviewController from './modules/activities/controller'

// Router
import './modules/playlists/router'
import './modules/breadcrumb/router'
import './modules/activities/router'
import './modules/navigation/router'

// Views
import NavigationView from './modules/navigation/views/Navigation'

class App extends Application {

    get regions() {
        return {
            main: '#region-main',
            breadcrumb: '#region-breadcrumb',
            navigation: '#region-navigation',
            adBlock: '#region-adblock'
        }
    }

    initialize() {
        this.listenTo(this, 'start', this._onStart);
    }

    navigate(route, options = { trigger: true }) {
        route = route || history.getFragment() || 'overview';

        history.navigate(route, options);
    }

    _onStart() {
        breadcrumbController.init(this.getRegion('breadcrumb'));
        playlistsController.init(this.getRegion('main'));
        overviewController.init(this.getRegion('main'));

        this._initNavigation();
        this._detectAdBlock();

        history.start();

        this.navigate();
    }
    
    _initNavigation() {
        this.getRegion('navigation').show(new NavigationView());
    }

    _detectAdBlock() {
        fuckAdBlock.on(true, () => {
            // detected
            this.getRegion('adBlock').$el.show();
        });
        fuckAdBlock.check();
    }
}

const app = new App();

export default app;