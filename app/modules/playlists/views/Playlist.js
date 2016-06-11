import {ItemView} from 'backbone.marionette'

const Playlist = ItemView.extend({

    ui: {
        link: '.js-link'
    },

    events: {
        'click @ui.link': '_onClickLink'
    },

    className: 'item col-xs-12 col-sm-3',

    template: require('../templates/playlist.ejs'),

    bindings: {
        ':el': {
            classes: {
                'is-loading': 'loadingItems'
            }
        }
    },

    onRender() {
        this.stickit();
    },

    _onClickLink() {
        this.model.set('loadingItems', true)
    }
});

const PlaylistEmpty = ItemView.extend({
    className: 'item item-empty text-center col-xs-12',

    template: require('../../search/templates/empty.ejs')
});

export {Playlist, PlaylistEmpty}