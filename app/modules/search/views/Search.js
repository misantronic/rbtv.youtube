import {Model} from 'backbone'
import {LayoutView} from 'backbone.marionette'

class Search extends LayoutView {
    constructor(options = {}) {
        _.defaults(options, {
            model: new Model()
        });

        super(options);
    }

    get className() {
        return 'layout-search search-container'
    }

    get template() {
        return require('../templates/search.ejs');
    }

    ui() {
        return {
            search: '.js-search',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp'
        }
    }

    events() {
        return {
            'click @ui.btnFilterRBTV': '_onSelectRBTV',
            'click @ui.btnFilterLP': '_onSelectLP'
        }
    }

    bindings() {
        return {
            '@ui.btnFilterRBTV': {
                classes: {
                    active: '_filterByRBTV'
                }
            },

            '@ui.btnFilterLP': {
                classes: {
                    active: '_filterByLP'
                }
            },

            '@ui.search': '_search'
        }
    }

    onRender() {
        this.stickit();
    }

    _onSelectRBTV() {
        const filterCheckboxBehavior = this.getOption('filterCheckboxBehavior');

        if(filterCheckboxBehavior) {
            // Checkbox-Behavior
            this.model.set('_filterByRBTV', !this.model.get('_filterByRBTV'));
        } else {
            // Radiobutton-Behavior
            this.model.set({
                _filterByRBTV: true,
                _filterByLP: false
            });
        }

        this.ui.btnFilterRBTV.blur();
    }

    _onSelectLP() {
        const filterCheckboxBehavior = this.getOption('filterCheckboxBehavior');

        if(filterCheckboxBehavior) {
            // Checkbox-Behavior (multiple-select)
            this.model.set('_filterByLP', !this.model.get('_filterByLP'));
        } else {
            // Radiobutton-Behavior (select only one)
            this.model.set({
                _filterByRBTV: false,
                _filterByLP: true
            });
        }

        this.ui.btnFilterLP.blur();
    }
}
export default Search