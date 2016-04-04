import _ from 'underscore'
import {Model} from 'backbone'
import {LayoutView} from 'backbone.marionette'
import AutocompleteView from './Autocomplete'
import {Autocomplete} from '../models/Autocomplete'
import autocompleteDefaults from '../data/autocompleteDefaults';

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

    regions() {
        return {
            autocomplete: '.region-autocomplete'
        }
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
    initialize() {
        let autocompleteEnabled = this.getOption('autocomplete');

        this._autocompleteEnabled = _.isUndefined(autocompleteEnabled) ? true : autocompleteEnabled;
    }

    onRender() {
        if(this._autocompleteEnabled) {
            this._autocompleteView = new AutocompleteView({ collection: new Autocomplete(autocompleteDefaults) });

            this.listenTo(this._autocompleteView, 'childview:link:selected', (itemView) => {
                let model = itemView.model;

                this.model.set({
                    _filterByRBTV: model.get('channel') === 'rbtv',
                    _filterByLP: model.get('channel') === 'lp',
                    _search: model.get('title')
                });

                this.ui.search.focus();
            });

            this.listenTo(this.model, 'change:_search', (model, val) => {
                this._autocompleteView.collection.search(val);
            });

            this.getRegion('autocomplete').show(this._autocompleteView);
        }

        this.stickit();
    }

    _onSelectRBTV() {
        const filterCheckboxBehavior = this.getOption('filterCheckboxBehavior');

        if (filterCheckboxBehavior) {
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

        if (filterCheckboxBehavior) {
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