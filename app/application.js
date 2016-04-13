import {Application} from 'backbone.marionette'
import {history} from 'backbone'
import $ from 'jquery'

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
import videosController from './modules/videos/controller'
import youtubeController from './modules/youtube/controller'

// Router
import './modules/playlists/router'
import './modules/activities/router'
import './modules/videos/router'
import './modules/navigation/controller'

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
        youtubeController.init();
        breadcrumbController.init(this.getRegion('breadcrumb'));
        playlistsController.init(this.getRegion('main'));
        overviewController.init(this.getRegion('main'));
        videosController.init(this.getRegion('main'));

        this._initNavigation();
        this._detectAdBlock();

        history.start();

        this.navigate();

        $(window).on('resize.app', (e) => {
            this.channel.trigger('resize', e);
        });
    }

    _initNavigation() {
        this.getRegion('navigation').show(new NavigationView());
    }

    _detectAdBlock() {
        // Workaround: fuckadblock is not working in ffx -> disable
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) return;

        fuckAdBlock.on(true, () => {
            // detected
            this.getRegion('adBlock').$el.show();
        });
    }
}

const app = new App();

export default app;