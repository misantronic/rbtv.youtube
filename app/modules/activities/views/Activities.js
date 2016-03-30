import $ from 'jquery'
import _ from 'underscore'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import Config from '../../../Config'
import {sessionStorage} from '../../../utils'

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
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.ui.link.removeAttr('data-toggle');
            this.ui.link.removeAttr('data-target');
        }
    }
}

class Activities extends CompositeView {
    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _filterByRBTV: true,
                _filterByLP: false,
                _showBtnToTop: false,
                _loading: false
            })
        });

        super(options);
    }

    events() {
        return {
            'click @ui.btnToTop': '_onBtnToTop',
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

                    this.renderChannel()
                }
            },

            'change:_filterByLP': (model, val) => {
                if (val) {
                    this._currentChannel = Config.channelLP;

                    this.renderChannel()
                }
            }
        }
    }

    ui() {
        return {
            link: '.js-link',
            btnToTop: '.js-btn-to-top',
            loader: '.js-loader',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp'
        }
    }

    bindings() {
        return {
            '@ui.btnToTop': {
                classes: {
                    show: '_showBtnToTop'
                }
            },

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

    renderChannel(nextPageToken = null) {
        this.model.set('_loading', true);

        if (!nextPageToken) {
            this.collection.reset();
        }

        this.collection
            .setNextPageToken(nextPageToken)
            .setChannelId(this._currentChannel)
            .fetch()
            .done(() => {
                this.model.set('_loading', false);
                this.render();
            })
    }

    _initScroll() {
        $(window).on('scroll.activities', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.activities');
    }

    _fetchNext() {
        const nextPageToken = this.collection.nextPageToken;

        if (nextPageToken) {
            this.renderChannel(nextPageToken);
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

    _onBtnToTop(e) {
        $('html, body').animate({ scrollTop: 0 }, 500);

        e.preventDefault();
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

        this.model.set('_showBtnToTop', y >= window.innerHeight)
    }
}

export default Activities