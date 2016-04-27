import _ from 'underscore'
import $ from 'jquery'
import {Model} from 'backbone'
import {LayoutView} from 'backbone.marionette'
import AutocompleteView from './Autocomplete'
import {Autocomplete as AutocompleteCollection} from '../models/Autocomplete'
import shows from '../../../data/shows';
import beans from '../../../data/beans';
import {props} from '../../decorators'

class Search extends LayoutView {
    @props({
        model: new Model({
            _filterByRBTV: true,
            _filterByLP: false,
            _search: '',
            _tags: []
        }),

        className: 'layout-search search-container',

        template: require('../templates/search.ejs'),

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
                    active: '_filterByRBTV'
                }
            },

            '@ui.btnFilterLP': {
                classes: {
                    active: '_filterByLP'
                }
            },

            '@ui.search': {
                observe: '_search',
                classes: {
                    'has-value': '_search'
                }
            }
        },

        /** @type {AutocompleteView} */
        _autocompleteView: null
    })

    modelEvents() {
        return {
            'change:_tags': (model, tags) => {
                let collection = new AutocompleteCollection(
                    _.map(tags, tagModel => _.omit(tagModel.attributes, '_selected'))
                );

                const view = new AutocompleteView({ collection });

                view.listenTo(view, 'childview:link:selected', itemView => {
                    collection.remove(itemView.model);

                    this.model.set('_tags', collection.models);
                });

                this.getRegion('autocompleteSelection').show(view);

                view.show();
            },

            'change:_search': (model, val) => {
                const tags = this.model.get('_tags');

                this._autocompleteView.collection.search(val, tags);
            }
        }
    }

    initialize() {
        const autocompleteEnabled = this.getOption('autocomplete');

        this._autocompleteEnabled = _.isUndefined(autocompleteEnabled) ? true : autocompleteEnabled;
    }

    onRender() {
        this._initAutocomplete();

        this.stickit();
    }

    _initAutocomplete() {
        if (!this._autocompleteEnabled) return;

        // Merge beans and shows
        const items = _.map(beans, bean => ({
            title: bean,
            expr: new RegExp('^' + bean.substr(0, 2), 'i'),
            channel: 'rbtv'
        })).concat(shows);

        let collection = new AutocompleteCollection(items);
        let view       = new AutocompleteView({ collection });

        this.listenTo(view, 'childview:link:selected', this._onAutocompleteLinkSelected);

        this.getRegion('autocomplete').show(view);

        this._autocompleteView = view;
    }

    _onSelectFilterButton(e) {
        const $button  = $(e.currentTarget);
        const filterBy = $button.data('filterby');
        let modelAttr, otherModelAttr;

        if (filterBy === 'rbtv') {
            modelAttr      = '_filterByRBTV';
            otherModelAttr = '_filterByLP';
        } else if (filterBy === 'lp') {
            modelAttr      = '_filterByLP';
            otherModelAttr = '_filterByRBTV';
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
        this.model.set('_search', '');
    }

    _onSearchKeyup(e) {
        switch (e.keyCode) {
            case 13: // ENTER
                this.trigger('search');
                break;
        }
    }

    _onSearchKeydown(e) {
        switch (e.keyCode) {
            case 8: // BACKSPACE
                if (this.ui.search.val() !== '') break;

                let tags = this.model.get('_tags');

                if (tags) {
                    tags = tags.slice(0);
                    tags.pop();

                    this.model.set('_tags', tags);
                }
                break;
        }
    }

    _onAutocompleteLinkSelected(itemView) {
        let model = itemView.model;
        let tags  = this.model.get('_tags') || [];

        // Clone array and push new value
        tags = tags.slice(0);
        tags.push(model);

        this.model.set({
            _filterByRBTV: model.get('channel') === 'rbtv',
            _filterByLP: model.get('channel') === 'lp',
            _tags: tags,
            _search: ''
        });

        this._autocompleteView.collection.remove(model);

        this.ui.search.focus();
    }
}
export default Search