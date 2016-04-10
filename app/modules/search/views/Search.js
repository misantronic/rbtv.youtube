import _ from 'underscore'
import {Model} from 'backbone'
import {LayoutView} from 'backbone.marionette'
import AutocompleteView from './Autocomplete'
import {Autocomplete} from '../models/Autocomplete'
import shows from '../../../data/shows';
import beans from '../../../data/beans';
import {props} from '../../decorators'

class Search extends LayoutView {
    @props({
        model: new Model(),

        className: 'layout-search search-container',

        template: require('../templates/search.ejs'),

        regions: {
            autocomplete: '.region-autocomplete'
        },

        ui: {
            search: '.js-search',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp',
            btnReset: '.js-reset'
        },

        events: {
            'click @ui.btnFilterRBTV': '_onSelectRBTV',
            'click @ui.btnFilterLP': '_onSelectLP',
            'click @ui.btnReset': '_onReset'
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
        }
    })

    initialize() {
        let autocompleteEnabled = this.getOption('autocomplete');

        this._autocompleteEnabled = _.isUndefined(autocompleteEnabled) ? true : autocompleteEnabled;
    }

    onRender() {
        if(this._autocompleteEnabled) {
            // Merge beans and shows
            let showBeans = _.map(beans, (bean) => {
                return {
                    title: bean,
                    expr: new RegExp('^'+ bean.substr(0, 2), 'i'),
                    channel: 'rbtv'
                }
            });

            this._autocompleteView = new AutocompleteView({ collection: new Autocomplete(shows.concat(showBeans)) });

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

    _onReset() {
        this.model.set('_search', '');
    }
}
export default Search