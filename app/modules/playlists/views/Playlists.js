import _ from 'underscore';
import $ from 'jquery';
import {CompositeView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import {localStorage} from '../../../utils';
import app from '../../../application';
import BtnToTop from '../../../behaviors/btnToTop/BtnToTop'

class Playlist extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-3';
    }

    get template() {
        return require('../templates/playlist.ejs');
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    events() {
        return {
            'click @ui.link': '_onClickLink'
        };
    }

    bindings() {
        return {
            ':el': {
                classes: {
                    loading: '_loading'
                }
            }
        }
    }

    onRender() {
        this.stickit();
    }

    _onClickLink() {
        this.model.set('_loading', true)
    }
}

class Playlists extends CompositeView {

    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _search: '',
                _filterByRBTV: true,
                _filterByLP: true,
                _loading: false
            })
        });

        super(options);
    }

    behaviors() {
        return {
            BtnToTop: {
                behaviorClass: BtnToTop
            }
        }
    }

    events() {
        return {
            'click @ui.btnFilterRBTV': '_onToggleRBTV',
            'click @ui.btnFilterLP': '_onToggleLP',
            'click @ui.link': '_onClickLink'
        };
    }

    modelEvents() {
        return {
            'change:_search': _.debounce(() => {
                this.searchCollection();
            }, 700),

            'change:_filterByRBTV change:_filterByLP': () => {
                this.searchCollection();
            }
        }
    }

    ui() {
        return {
            link: '.js-link',
            search: '.js-search',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp',
            btnToTop: '.js-btn-to-top',
            loader: '.js-loader'
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

            '@ui.search': '_search',

            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            }
        };
    }

    get className() {
        return 'layout-playlists'
    }

    get childView() {
        return Playlist;
    }

    get childViewContainer() {
        return '.js-playlists'
    }

    get template() {
        return require('../templates/playlists.ejs');
    }

    /** @returns {{search: String, rbtv: String|null, lp: String|null}} */
    get channelFilter() {
        return {
            search: this.model.get('_search'),
            rbtv: this.model.get('_filterByRBTV'),
            lp: this.model.get('_filterByLP')
        }
    }

    set loading(val) {
        this.model.set('_loading', val);
    }

    initialize() {

    }

    onRender() {
        this.stickit();
    }

    searchCollection(fromCache = false) {
        this.loading = false;

        let filter;

        if (fromCache) {
            filter = localStorage.get('playlists.filter');

            if (filter) {
                this.model.set({
                    _search: filter.search,
                    _filterByRBTV: filter.rbtv,
                    _filterByLP: filter.lp
                });
            }
        }

        if (!filter) {
            filter = this.channelFilter;
        }

        this.collection.search(filter);

        // Cache
        localStorage.set('playlists.filter', filter);
    }

    _onClickLink(e) {
        const $link = $(e.currentTarget);
        let route   = $link.attr('href');

        this.model.set('_loading', true);

        app.navigate(route);

        e.preventDefault();
    }

    _onToggleRBTV() {
        this.model.set('_filterByRBTV', !this.model.get('_filterByRBTV'));

        this.ui.btnFilterRBTV.blur();
    }

    _onToggleLP() {
        this.model.set('_filterByLP', !this.model.get('_filterByLP'));

        this.ui.btnFilterLP.blur();
    }
}

export default Playlists