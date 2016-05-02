import $ from 'jquery'
import _ from 'underscore'
import {CompositeView} from 'backbone.marionette'
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

    modelEvents() {
        return {
            'change:_filterByRBTV change:_filterByLP change:_tags': _.debounce(this._updateSearch, 350)
        }
    }

    set loading(val) {
        this.model.set('_loading', val);
    }

    initialize() {
        this._currentChannel = Config.channelRBTV;

        this.listenTo(this, 'search', this._updateSearch);
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
            .done(data => {
                this.loading = false;

                this._initScroll();
                this._fetchVideoDetails(data);
            })
    }

    _updateSearch() {
        if (this.model.get('_filterByRBTV')) {
            this._currentChannel = Config.channelRBTV;
        } else if (this.model.get('_filterByLP')) {
            this._currentChannel = Config.channelLP;
        }

        if (!this._search()) {
            // Re-init activities
            this.renderActivities();
        }
    }

    /**
     * @returns {String}
     * @private
     */
    _search() {
        let searchVal     = this.model.get('_search');
        let tagCollection = this.model.get('_tags');

        searchVal = (searchVal + ' ' + tagCollection.map(tagModel => tagModel.get('title')).join(' ')).trim();

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

            if (this.$currentSearchXHR) {
                this.$currentSearchXHR.abort();
            }

            this.$currentSearchXHR = view.renderSearchResults(this._currentChannel);
        } else {
            this.$('.js-search-items').empty();
        }

        return searchVal;
    }

    _fetchVideoDetails(collectionData) {
        let videoIds = _.map(collectionData.items, modelData => {
            return modelData.contentDetails.upload.videoId;
        });

        if (videoIds.length) {
            let videoCollection = new VideoCollection();

            videoCollection
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each(activityModel => {
                        let id         = activityModel.get('videoId');
                        let videoModel = videoCollection.findWhere({ id });

                        if (videoModel) {
                            // Set tags on activitiy-model
                            activityModel.set({
                                tags: videoModel.get('tags'),
                                duration: videoModel.get('duration')
                            });
                        }
                    });
                });
        }
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

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._fetchNext();
        }
    }
}

export default Activities