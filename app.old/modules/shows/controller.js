import * as Marionette from 'backbone.marionette';
import ShowsLayout from './views/ShowsLayout';
import channels from '../../channels';

//import './styles/shows.scss';

const ShowsController = Marionette.Object.extend({
    init(region) {
        this._region = region;
    },

    initShows() {
        this._showActivities();

        // Update breadcrumb
        channels.breadcrumb.replace({ title: 'Shows', route: 'shows' });
    },

    _showActivities() {
        this._region.show(
            new ShowsLayout()
        );
    }
});

export default new ShowsController();
