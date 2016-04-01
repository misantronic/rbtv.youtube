import $ from 'jquery'
import _ from 'underscore'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import Config from '../../../Config'
import BtnToTop from '../../../behaviors/btnToTop/BtnToTop'
import searchController from '../../search/controller'

class Activity extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-4';
    }

    get template() {
        return require('../templates/activity.ejs');
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    onRender() {
        // Remove modal-settings for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.ui.link.removeAttr('data-toggle');
            this.ui.link.removeAttr('data-target');
        }
    }
}

class Activities extends CompositeView {
    constructor(options = {}) {
        _.defaults(options, {
            model: new Model({
                _filterByRBTV: true,
                _filterByLP: false,
                _loading: false,
                _search: ''
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
            'click @ui.btnFilterRBTV': '_onSelectRBTV',
            'click @ui.btnFilterLP': '_onSelectLP',
            'click @ui.link': '_onCLickLink'
        }
    }

    modelEvents() {
        return {
            'change:_filterByRBTV': (model, val) => {
                if (val) {
                    this._currentChannel = Config.channelRBTV;

                    this.renderActivities()
                }
            },

            'change:_filterByLP': (model, val) => {
                if (val) {
                    this._currentChannel = Config.channelLP;

                    this.renderActivities()
                }
            },

            'change:_search': _.debounce(() => {
                if(!this._search()) {
                    // Re-init activities
                    this.renderActivities();
                }
            }, 500)
        }
    }

    ui() {
        return {
            search: '.js-search',
            link: '.js-link',
            loader: '.js-loader',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp'
        }
    }

    bindings() {
        return {
            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            },

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

            ':el': {
                classes: {
                    loading: '_loading'
                }
            }
        }
    }

    get className() {
        return 'layout-activities'
    }

    get childView() {
        return Activity;
    }

    get childViewContainer() {
        return '.js-activities'
    }

    get template() {
        return require('../templates/activities.ejs');
    }

    set loading(val) {
        this.model.set('_loading', val);
    }

    initialize() {
        this._currentChannel = Config.channelRBTV;
    }

    onRender() {
        this._initScroll();

        this.stickit();
    }

    onDestroy() {
        this._killScroll();
    }

    renderActivities(nextPageToken = null) {
        if (this.$childViewContainer) {
            this.$childViewContainer.show();
        }

        this.loading = true;

        if (!nextPageToken) {
            this.collection.reset();
        }

        // Check search
        if (this._search()) {
            return;
        }

        this.collection
            .setNextPageToken(nextPageToken)
            .setChannelId(this._currentChannel)
            .fetch()
            .done(() => {
                this.loading = false;

                this.render();
            })
    }

    /**
     * @returns {String}
     * @private
     */
    _search() {
        var searchVal = this.model.get('_search');

        if (searchVal) {
            // Init search

            this._killScroll();
            if (this.$childViewContainer) {
                this.$childViewContainer.hide();
            }

            /** @type {SearchView} */
            var view = searchController.prepareSearch(searchVal);

            this.listenTo(view, 'loading:start', () => {
                this.loading = true;
            });

            this.listenTo(view, 'loading:stop', () => {
                this.loading = false;
            });

            view.renderSearch(this._currentChannel).done(() => {
                // Attach html
                this.$('.js-search-items').html(view.$el).show();
            });
        } else {
            this.$('.js-search-items').empty();
        }

        return searchVal;
    }

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.activities', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.activities');
    }

    _fetchNext() {
        const nextPageToken = this.collection.nextPageToken;

        if (nextPageToken) {
            this.renderActivities(nextPageToken);
        }
    }

    _onSelectRBTV() {
        this.model.set({
            _filterByRBTV: true,
            _filterByLP: false
        });
    }

    _onSelectLP() {
        this.model.set({
            _filterByRBTV: false,
            _filterByLP: true
        });
    }

    _onCLickLink(e) {
        const $link   = $(e.currentTarget);
        const videoId = $link.data('videoid');
        const title   = $link.data('title');

        this.$('#modal-activities-body').replaceWith('<div id="modal-activities-body"></div>');

        this.$('.js-modal-activities')
            .one('shown.bs.modal', () => {
                this._player = new YT.Player('modal-activities-body', {
                    height: '390',
                    width: '100%',
                    videoId: videoId
                });
            })
            .find('.js-modal-title').text(title);
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._killScroll();
            this._fetchNext();
        }
    }
}

export default Activities