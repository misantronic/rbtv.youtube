import _ from 'underscore'
import $ from 'jquery'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {localStorage} from '../../../utils'
import app from '../../../application'
import {props} from '../../decorators'

class Playlist extends ItemView {

    @props({
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
        }
    })

    onRender() {
        this.stickit();
    }

    _onClickLink() {
        this.model.set('loadingItems', true)
    }
}

class PlaylistEmpty extends ItemView {
    @props({
        className: 'item item-empty text-center col-xs-12',

        template: require('../../search/templates/empty.ejs')
    })

    initialize() {

    }
}

class Playlists extends CompositeView {

    constructor(options = {}) {
        super(options);
    }

    @props({
        className: 'layout-playlists',

        childView: Playlist,

        emptyView: PlaylistEmpty,

        template: require('../templates/playlists.ejs'),

        childViewContainer: '.js-playlists',

        behaviors: {
            BtnToTop: {},
            Search: {
                container: '.js-search-container',
                filterCheckboxBehavior: true,
                autocomplete: false
            }
        },

        events: {
            'click @ui.link': '_onClickLink'
        },

        ui: {
            link: '.js-link',
            loader: '.js-loader'
        },

        bindings: {
            '@ui.loader': {
                classes: {
                    show: 'loading'
                }
            },

            ':el': {
                classes: {
                    'is-loading': 'loading'
                }
            }
        },

        model: new Model({
            search: '',
            filterByRBTV: true,
            filterByLP: true,
            loading: false,
            loadingItems: false
        })
    })

    /** @returns {{search: String, rbtv: String|null, lp: String|null}} */
    get channelFilter() {
        return {
            search: this.model.get('search'),
            rbtv: this.model.get('filterByRBTV'),
            lp: this.model.get('filterByLP')
        }
    }

    set loading(val) {
        this.model.set('loading', val);
    }

    modelEvents() {
        return {
            'change:search': _.debounce(() => {
                this.renderCollection(
                    _.extend(this.channelFilter, { resetResults: true })
                );
            }, 700),

            'change:filterByRBTV change:filterByLP': () => {
                this.renderCollection(
                    _.extend(this.channelFilter, { resetResults: true })
                );
            }
        }
    }

    onRender() {
        this.stickit();
    }

    onDestroy() {
        this._killScroll();
    }

    /**
     *
     * @param {Boolean|Object} filter
     */
    renderCollection(filter = false) {
        if (filter === true) {
            filter = localStorage.get('playlists.filter');

            if (filter) {
                this.model.set({
                    search: filter.search,
                    filterByRBTV: filter.rbtv,
                    filterByLP: filter.lp
                });
            }
        }

        if (!filter) {
            filter = this.channelFilter;
        }

        // Cache filter
        localStorage.set('playlists.filter', _.omit(filter, 'increaseResults', 'resetResults'));

        this.loading = false;

        // Search collection
        this.collection.search(filter);

        this._initScroll();
    }

    _onClickLink(e) {
        const $link = $(e.currentTarget);
        let route   = $link.attr('href').substr(1);

        app.navigate(route);

        e.preventDefault();
    }

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.playlists', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.playlists');
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 600;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._killScroll();

            this.renderCollection(
                _.extend(this.channelFilter, { increaseResults: true })
            );
        }
    }
}

export default Playlists