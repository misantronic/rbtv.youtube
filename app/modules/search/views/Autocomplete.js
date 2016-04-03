import {CollectionView, ItemView} from 'backbone.marionette'

class AutocompleteItem extends ItemView {
    get template() {
        return require('../templates/autocompleteItem.ejs')
    }

    get tagName() {
        return 'span'
    }

    get className() {
        return 'item-autocomplete label label-info'
    }

    bindings() {
        return {
            ':el': {
                classes: {
                    selected: '_selected'
                }
            }
        }
    }

    events() {
        return {
            'click .js-item': '_onClicked',
            'focus .js-item': '_onFocus',
            'blur .js-item': '_onBlur'
        }
    }

    onRender() {
        this.stickit();
    }

    _onClicked(e) {
        this.trigger('link:selected', this);

        e.preventDefault();

        this._onBlur();
    }

    _onFocus() {
        this.model.set('_selected', true);
    }

    _onBlur() {
        this.model.set('_selected', false);
    }
}

class Autocomplete extends CollectionView {
    get className() {
        return 'items-autocomplete'
    }

    get childView() {
        return AutocompleteItem
    }

    collectionEvents() {
        return {
            reset: () => {
                this.collection.length
                    ? this.show()
                    : this.hide();
            }
        }
    }

    onShow() {
        this.hide();
    }

    show() {
        this.$el.show();
    }

    hide() {
        this.$el.hide();
    }
}

export default Autocomplete