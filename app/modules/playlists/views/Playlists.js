import _ from 'underscore';
import $ from 'jquery';
import {CompositeView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import {localStorage} from '../../../utils';
import app from '../../../application';
import BehaviorBtnToTop from '../../../behaviors/btnToTop/BtnToTop'
import BehaviorSearch from '../../../behaviors/search/Search'

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

class PlaylistEmpty extends ItemView {
    get className() {
        return 'item item-empty text-center col-xs-12';
    }

    get template() {
        return require('../../search/templates/empty.ejs');
    }
}

class Playlists extends CompositeView {

    constructor(options = {}) {
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
                behaviorClass: BehaviorBtnToTop
            },
            Search: {
                behaviorClass: BehaviorSearch,
                container: '.js-search-container',
                filterCheckboxBehavior: true
            }
        }
    }

    events() {
        return {
            'click @ui.link': '_onClickLink'
        };
    }

    modelEvents() {
        return {
            'change:_search': _.debounce(() => {
                this.renderCollection(
                    _.extend(this.channelFilter, { resetResults: true })
                );
            }, 700),

            'change:_filterByRBTV change:_filterByLP': () => {
                this.renderCollection(
                    _.extend(this.channelFilter, { resetResults: true })
                );
            }
        }
    }

    ui() {
        return {
            link: '.js-link',
            loader: '.js-loader'
        }
    }

    bindings() {
        return {
            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            },

            ':el': {
                classes: {
                    loading: '_loading'
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

    get emptyView() {
        return PlaylistEmpty;
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
                    _search: filter.search,
                    _filterByRBTV: filter.rbtv,
                    _filterByLP: filter.lp
                });
            }
        }

        if (!filter) {
            filter = this.channelFilter;
        }

        // Cache filter
        localStorage.set('playlists.filter', filter);

        this.loading = false;

        // Search collection
        this.collection.search(filter);

        this._initScroll();
    }

    _onClickLink(e) {
        const $link = $(e.currentTarget);
        let route   = $link.attr('href').substr(1);

        this.loading = true;

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