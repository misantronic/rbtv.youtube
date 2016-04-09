import $ from 'jquery'
import _ from 'underscore'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import Config from '../../../Config'
import BehaviorBtnToTop from '../../../behaviors/btnToTop/BtnToTop'
import BehaviorSearch from '../../../behaviors/search/Search'
import searchController from '../../search/controller'
import shows from '../../../data/shows';
import VideoCollection from '../../videos/models/Videos'
import {SearchResult} from '../../search/views/SearchResults'
import {props} from '../../decorators'

class Activities extends CompositeView {

    @props({
        className: 'layout-activities',

        childView: SearchResult,

        childViewContainer: '.js-activities',

        template: require('../templates/activities.ejs'),

        model: new Model({
            _filterByRBTV: true,
            _filterByLP: false,
            _loading: false,
            _search: ''
        }),

        behaviors: {
            BtnToTop: {
                behaviorClass: BehaviorBtnToTop
            },
            Search: {
                behaviorClass: BehaviorSearch,
                container: '.js-search-container'
            }
        },

        events: {
            'click @ui.link': '_onCLickLink'
        },

        modelEvents: {
            'change:_filterByRBTV change:_filterByLP change:_search': _.debounce(function () {
                if (this.model.get('_filterByRBTV')) {
                    this._currentChannel = Config.channelRBTV;
                } else if (this.model.get('_filterByLP')) {
                    this._currentChannel = Config.channelLP;
                }

                if (!this._search()) {
                    // Re-init activities
                    this.renderActivities();
                }
            }, 350)
        },

        ui: {
            link: '.js-link',
            loader: '.js-loader',
            btnPlaylist: '.js-playlist'
        },

        bindings: {
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
                        onGet: function (title) {
                            let autocompleteObj = _.findWhere(shows, { title });

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
        },

        /** @type {xhr} */
        _currentSearchXHR: null
    })

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
            .done((data) => {
                this.loading = false;

                this._initScroll();
                this._fetchVideoDetails(data);
            })
    }

    /**
     * @returns {String}
     * @private
     */
    _search() {
        let searchVal = this.model.get('_search');

        if (searchVal) {
            // Init search

            this._killScroll();
            if (this.$childViewContainer) {
                this.$childViewContainer.hide();
            }

            /** @type {SearchResults} */
            let view = searchController.prepareSearch(searchVal);

            this.listenTo(view, 'loading:start', () => {
                this.loading = true;
            });

            this.listenTo(view, 'loading:stop', () => {
                this.loading = false;
            });

            // Attach html
            this.$('.js-search-items').html(view.render().$el);

            if(this.$currentSearchXHR) {
                this.$currentSearchXHR.abort();
            }

            this.$currentSearchXHR = view.renderSearchResults(this._currentChannel);
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

    _fetchVideoDetails(activitiesData) {
        let videoIds = _.map(activitiesData.items, (activityData) => {
            return activityData.contentDetails.upload.videoId;
        });

        if(videoIds.length) {
            let videoCollection = new VideoCollection();

            videoCollection
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each((activityModel) => {
                        let id         = activityModel.get('videoId');
                        let videoModel = videoCollection.findWhere({ id });

                        if (videoModel) {
                            // Set tags on activitiy-model
                            activityModel.set(
                                'tags',
                                videoModel.get('tags')
                            );
                        }
                    });
                });
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