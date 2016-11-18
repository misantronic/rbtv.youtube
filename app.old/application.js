import {Application, Behaviors} from 'backbone.marionette';
import {history} from 'backbone';
import $ from 'jquery';
import channels from './channels';

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss';
import '../assets/css/components.scss';

// Modules & overrides
import '../node_modules/moment/locale/de';
import './overrides/backbone';
import './overrides/marionette.stickit';
import './overrides/marionette';
import './overrides/underscore';

// Behaviors
import BehaviorBtnToTop from './behaviors/btnToTop/BtnToTop';
import BehaviorSearch from './behaviors/search/Search';
import BehaviorLoader from './behaviors/loader/Loader';

// Controller
import './modules/navigation/controller';

// Views
import NavigationLayout from './modules/navigation/views/NavigationLayout';

const App = Application.extend({

    regions: {
        main: '#region-main',
        breadcrumb: '#region-breadcrumb',
        navigation: '#region-navigation',
        adBlock: '#region-adblock'
    },

    initialize() {
        Behaviors.behaviorsLookup = function () {
            return {
                Search: BehaviorSearch,
                BtnToTop: BehaviorBtnToTop,
                Loader: BehaviorLoader
            };
        };

        this.listenTo(this, 'start', this._onStart);
    },

    navigate(route, options = {}) {
        route = route || history.getFragment() || 'activities';
        options = _.extend({ trigger: true }, options);

        history.navigate(route, options);
    },

    _onStart() {
        $(window).on('resize.app', e => channels.app.trigger('resize', e));

        console.log('<developer>');
        console.log('\tIf you want to support this project, please go to');
        console.log('\thttps://github.com/misantronic/rbtv.youtube :)');
        console.log('</developer>');
    },

    initNavigation() {
        this.getRegion('navigation').show(new NavigationLayout());

        return this;
    },

    initBreadcrumb() {
        const breadcrumbConroller = require('./modules/breadcrumb/controller');
        const breadcrumbRegion = this.getRegion('breadcrumb');

        breadcrumbConroller.init(breadcrumbRegion);

        return this;
    },

    detectAdBlock() {
        // Workaround: fuckadblock is not working in ffx -> disable
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) return;

        fuckAdBlock.on(true, () => {
            // detected
            this.getRegion('adBlock').$el.show();
        });

        return this;
    }
});

export default new App();
