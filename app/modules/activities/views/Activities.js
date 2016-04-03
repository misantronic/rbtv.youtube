import $ from 'jquery'
import _ from 'underscore'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import Config from '../../../Config'
import BehaviorBtnToTop from '../../../behaviors/btnToTop/BtnToTop'
import BehaviorSearch from '../../../behaviors/search/Search'
import searchController from '../../search/controller'
import autocompleteDefaults from '../../search/data/autocompleteDefaults';

class Activity extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-4';
    }

    get template() {
        return require('../../search/templates/videoItem.ejs');
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
                behaviorClass: BehaviorBtnToTop
            },
            Search: {
                behaviorClass: BehaviorSearch,
                container: '.js-search-container'
            }
        }
    }

    events() {
        return {
            'click @ui.link': '_onCLickLink'
        }
    }

    modelEvents() {
        return {
            'change:_filterByRBTV change:_filterByLP change:_search': _.debounce(() => {
                if(this.model.get('_filterByRBTV')) {
                    this._currentChannel = Config.channelRBTV;
                } else if(this.model.get('_filterByLP')) {
                    this._currentChannel = Config.channelLP;
                }

                if (!this._search()) {
                    // Re-init activities
                    this.renderActivities();
                }
            }, 350)
        }
    }

    ui() {
        return {
            link: '.js-link',
            loader: '.js-loader',
            btnPlaylist: '.js-playlist'
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
            },

            '@ui.btnPlaylist': {
                classes: {
                    show: {
                        observe: '_search',
                        onGet: (title) => {
                            var autocompleteObj = _.findWhere(autocompleteDefaults, { title });

                            if (autocompleteObj && autocompleteObj.playlistId) {
                                this.ui.btnPlaylist
                                    .attr('href', `#playlists/playlist/${autocompleteObj.playlistId}`)
                                    .text(`Zur '${autocompleteObj.title}' Playlist`);

                                return true;
                            }

                            this.ui.btnPlaylist
                                .attr('href', 'javascript:void(0)')
                                .text('');

                            return false;
                        }
                    }
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

                this._initScroll();
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

            /** @type {SearchResults} */
            var view = searchController.prepareSearch(searchVal);

            this.listenTo(view, 'loading:start', () => {
                this.loading = true;
            });

            this.listenTo(view, 'loading:stop', () => {
                this.loading = false;
            });

            // Attach html
            this.$('.js-search-items').html(view.render().$el);

            view.renderSearchResults(this._currentChannel);
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
            this._killScroll();

            this.renderActivities(nextPageToken);
        }
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
            this._fetchNext();
        }
    }
}

export default Activities