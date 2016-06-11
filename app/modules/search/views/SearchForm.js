import _ from 'underscore';
import $ from 'jquery';
import {LayoutView} from 'backbone.marionette';
import AutocompleteView from './Autocomplete';
import {Autocomplete as AutocompleteCollection} from '../models/Autocomplete';
import shows from '../../../data/shows';
import beans from '../../../data/beans';
import {props} from '../../decorators';

class SearchForm extends LayoutView {
    @props({
        className: 'layout-search search-container',

        template: require('../templates/search-form.ejs'),

        regions: {
            autocomplete: '.region-autocomplete',
            autocompleteSelection: '.region-autocomplete-selection'
        },

        ui: {
            search: '.js-search',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp',
            btnReset: '.js-reset'
        },

        events: {
            'click @ui.btnFilterRBTV': '_onSelectFilterButton',
            'click @ui.btnFilterLP': '_onSelectFilterButton',
            'click @ui.btnReset': '_onReset',
            'keyup @ui.search': '_onSearchKeyup',
            'keydown @ui.search': '_onSearchKeydown'
        },

        bindings: {
            '@ui.btnFilterRBTV': {
                classes: {
                    active: 'filterByRBTV'
                }
            },

            '@ui.btnFilterLP': {
                classes: {
                    active: 'filterByLP'
                }
            },

            '@ui.search': {
                observe: 'search',
                classes: {
                    'has-value': 'search'
                }
            }
        },


        channels: {
            app: {
                'tag:selected': '_onAutocompleteLinkSelected' // Listen to tag-events in search-results/activities
            }
        }
    })

    initialize() {
        this._autocompleteEnabled = _.isUndefined(this.getOption('autocomplete')) ? true : this.getOption('autocomplete');

        const tagCollection = this.model.get('tags');

        this.listenTo(tagCollection, 'add remove', this._updateTags);
    }

    onBeforeShow() {
        this._initAutocomplete();
        this._updateTags();

        this.stickit();
    }

    _initAutocomplete() {
        if (!this._autocompleteEnabled) return;

        // Merge beans and shows
        const items = beans.concat(shows);

        const collection = new AutocompleteCollection(items);
        const view = new AutocompleteView({collection});

        this.listenTo(view, 'childview:link:selected', this._onAutocompleteLinkSelected);
        this.listenTo(view, 'childview:link:selected', itemView => collection.remove(itemView.model.get('title')));

        this.listenTo(this.model, 'change:search', (model, val) => collection.search(val, this.model.get('tags').models));

        this.getRegion('autocomplete').show(view.hide());
    }

    _updateTags() {
        const collection = this.model.get('tags');
        const view = new AutocompleteView({collection});

        view.listenTo(view, 'childview:link:selected', itemView => collection.remove(itemView.model));

        this.getRegion('autocompleteSelection').show(view);

        _.defer(this.triggerSearch.bind(this));
    }

    _onSelectFilterButton(e) {
        const $button = $(e.currentTarget);
        const filterBy = $button.data('filterby');
        let modelAttr, otherModelAttr;

        if (filterBy === 'rbtv') {
            modelAttr = 'filterByRBTV';
            otherModelAttr = 'filterByLP';
        } else if (filterBy === 'lp') {
            modelAttr = 'filterByLP';
            otherModelAttr = 'filterByRBTV';
        }

        const filterCheckboxBehavior = this.getOption('filterCheckboxBehavior');

        if (filterCheckboxBehavior) {
            // Checkbox-Behavior
            this.model.set(modelAttr, !this.model.get(modelAttr));
        } else {
            // Radiobutton-Behavior
            this.model.set({
                [modelAttr]: true,
                [otherModelAttr]: false
            });
        }

        $button.blur();
    }

    _onReset() {
        this.model.set('search', '');
        this.triggerSearch();
    }

    _onSearchKeyup(e) {
        switch (e.keyCode) {
            case 13: // ENTER
                this.triggerSearch();
                break;
        }
    }

    _onSearchKeydown(e) {
        switch (e.keyCode) {
            case 8: // BACKSPACE
                if (this.ui.search.val() !== '') break;

                const tagCollection = this.model.get('tags');

                if (tagCollection.length > 0) {
                    tagCollection.remove(tagCollection.last());
                }
                break;
        }
    }

    _onAutocompleteLinkSelected(itemView) {
        const model = itemView.model;

        this.model.get('tags').add(model);

        let modelAttrs = {
            filterByRBTV: model.get('channel') === 'rbtv',
            filterByLP: model.get('channel') === 'lp',
            search: ''
        };

        // Kill filter attributes if none was chosen by tag
        if (modelAttrs.filterByLP === false && modelAttrs.filterByRBTV === false) {
            modelAttrs = _.omit(modelAttrs, 'filterByLP', 'filterByRBTV');
        }

        this.model.set(modelAttrs);

        this.ui.search.focus();
    }

    triggerSearch() {
        this.trigger('search');
    }
}
export default SearchForm;
