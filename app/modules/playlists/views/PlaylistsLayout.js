import _ from 'underscore'
import $ from 'jquery'
import {LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import PlaylistsList from './PlaylistsList'
import {localStorage} from '../../../utils'
import app from '../../../application'
import {props} from '../../decorators'

class Playlists extends LayoutView {

    @props({
        className: 'layout-playlists',

        template: require('../templates/playlists.ejs'),

        regions: {
            list: '.js-playlists'
        },

        behaviors: {
            BtnToTop: {},
            Search: {
                container: '.js-search-container',
                filterCheckboxBehavior: true,
                autocomplete: false
            },
            Loader: {}
        },

        events: {
            'click @ui.link': '_onClickLink'
        },

        ui: {
            link: '.js-link',
            loader: '.js-loader'
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
    
    startLoading() {
        this.model.set('loading', true);
    }
    
    stopLoading() {
        this.model.set('loading', false);
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
        this.getRegion('list').show(
            new PlaylistsList({
                collection: this.collection
            })
        );

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

        this.stopLoading();

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