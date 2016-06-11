import {CollectionView, ItemView} from 'backbone.marionette';

const AutocompleteItem = ItemView.extend({
    template: require('../templates/autocomplete-item.ejs'),

    tagName: 'a',

    className: 'item-autocomplete js-item label label-info',

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

const Autocomplete = CollectionView.extend({
    className: 'items-autocomplete',

    childView: AutocompleteItem,

    collectionEvents() {
        return {
            reset: () => {
                this.collection.length
                    ? this.show()
                    : this.hide();
            }
        };
    },

    show() {
        this.$el.show();

        return this;
    },

    hide() {
        this.$el.hide();

        return this;
    }
});

export default Autocomplete;
