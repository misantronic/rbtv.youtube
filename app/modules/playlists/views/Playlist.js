import {ItemView} from 'backbone.marionette'

const Playlist = ItemView.extend({

    ui: {
        link: '.js-link'
    },

    className: 'item col-xs-12 col-sm-3',

    template: require('../templates/playlist.ejs')
});

const PlaylistEmpty = ItemView.extend({
    className: 'item item-empty text-center col-xs-12',

    template: require('../../search/templates/empty.ejs')
});

export {Playlist, PlaylistEmpty}