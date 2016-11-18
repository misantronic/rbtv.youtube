import {ItemView} from 'backbone.marionette';

const Tag = ItemView.extend({
    template: require('../templates/tag.ejs'),

    tagName: 'a',

    className: 'item-tag js-item label label-info',

    bindings: {
        ':el': {
            classes: {
                selected: '_selected'
            }
        }
    },

    attributes: {
        href: typeof playlistId !== 'undefined' ? '#playlists/playlist/' + this.model.get('playlistId') : ''
    },

    events: {
        click: '_onClicked',
        focus: '_onFocus',
        blur: '_onBlur'
    },

    onRender() {
        this.stickit();
    },

    _onClicked(e) {
        this.trigger('link:selected', this);

        e.preventDefault();

        this._onBlur();
    },

    _onFocus() {
        this.model.set('_selected', true);
    },

    _onBlur() {
        this.model.set('_selected', false);
    }
});

export default Tag;
