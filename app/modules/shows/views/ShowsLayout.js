import * as _ from 'underscore';
import {LayoutView} from 'backbone.marionette';
import ShowsList from './Shows';
import {Collection} from 'backbone';
import showsData from '../../../data/shows';

const Shows = LayoutView.extend({

    className: 'layout-shows',

    regions: {
        shows: '.region-shows'
    },

    template: require('../templates/showsLayout.ejs'),

    /**
     * Lifecycle methods
     */

    onBeforeShow() {
        this._showList();
    },

    /**
     * Private methods
     */

    _showList() {
        const collection = new Collection(
            _.filter(showsData, show => {
                return show.playlistId
            })
        );

        this.getRegion('shows').show(
            new ShowsList({ collection })
        );
    }

    /**
     * Event handler
     */

});

export default Shows;
