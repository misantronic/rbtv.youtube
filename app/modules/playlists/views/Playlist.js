import {ItemView} from 'backbone.marionette';

/**
 * @class PlaylistItem
 */
const Playlist = ItemView.extend({

    ui: {
        link: '.js-link'
    },

    behaviors: {
        Loader: {
            container: '.loader-container'
        }
    },
    
    events: {
        'click @ui.link': '_onClick'
    },

    className: 'item col-xs-12 col-sm-3',

    template: require('../templates/playlist.ejs'),

    _onClick() {
        this.model.set('loading', true);
    }
});

const PlaylistEmpty = ItemView.extend({
    className: 'item item-empty text-center col-xs-12',

    template: require('../../search/templates/empty.ejs')
});

export {Playlist, PlaylistEmpty};
