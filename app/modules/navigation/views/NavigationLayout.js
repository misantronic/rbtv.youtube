import {LayoutView} from 'backbone.marionette';
import {Navigation as NavigationListView} from './Navigation';
import Config from '../../../Config';

const NavigationLayout = LayoutView.extend({
    template: require('../templates/navigation-layout.ejs'),

    regions: {
        list: '#region-navigation-list'
    },

    onBeforeShow: function () {
        this.getRegion('list').show(
            new NavigationListView({
                collection: Config.navigation
            })
        );
    }
});

export default NavigationLayout;
