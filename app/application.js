import {Application, Behaviors} from 'backbone.marionette'
import {history} from 'backbone'
import $ from 'jquery'
import channels from './channels'

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss'
import '../assets/css/playlists.scss';

// Modules & overrides
import '../node_modules/moment/locale/de'
import './overrides/marionette.stickit'
import './overrides/marionette.js'
import './overrides/underscore'

// Behaviors
import BehaviorBtnToTop from './behaviors/btnToTop/BtnToTop'
import BehaviorRadio from './behaviors/radio/Radio'
import BehaviorSearch from './behaviors/search/Search'

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
        Behaviors.behaviorsLookup = function() {
            return {
                Search: BehaviorSearch,
                BtnToTop: BehaviorBtnToTop,
                Radio: BehaviorRadio
            };
        };

        this.listenTo(this, 'start', this._onStart);
    }

    navigate(route, options = { trigger: true }) {
        route = route || history.getFragment() || 'overview';

        history.navigate(route, options);
    }

    _onStart() {
        const mainRegion = this.getRegion('main');
        const bcRegion   = this.getRegion('breadcrumb');

        youtubeController.init();
        breadcrumbController.init(bcRegion);
        playlistsController.init(mainRegion);
        overviewController.init(mainRegion);
        videosController.init(mainRegion);

        this._initNavigation();
        this._detectAdBlock();

        history.start();

        this.navigate();

        $(window).on('resize.app', e => {
            channels.app.trigger('resize', e);
        });
    }

    _initNavigation() {
        this.getRegion('navigation').show(new NavigationView());
    }

    _detectAdBlock() {
        // Workaround: fuckadblock is not working in ffx -> disable
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) return;

        fuckAdBlock.on(true, () => {
            // detected
            this.getRegion('adBlock').$el.show();
        });
    }
}

const app = new App();

export default app;