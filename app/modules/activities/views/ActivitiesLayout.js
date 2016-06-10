import $ from 'jquery'
import _ from 'underscore'
import {LayoutView} from 'backbone.marionette'
import ActivitiesList from './ActivitiesList'
import SearchFormModel from '../../search/models/SearchForm'
import Config from '../../../Config'
import searchController from '../../search/controller'
import shows from '../../../data/shows';
import VideoCollection from '../../videos/models/Videos'
import {props} from '../../decorators'

class Activities extends LayoutView {

    @props({
        className: 'layout-activities',

        regions: {
            items: '.js-items'
        },

        template: require('../templates/activities.ejs'),

        behaviors: {
            BtnToTop: {},
            Search: {
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
                    show: 'loading'
                }
            },

            ':el': {
                classes: {
                    loading: 'loading'
                }
            },

            '@ui.btnPlaylist': {
                classes: {
                    show: {
                        observe: 'search',
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

        /** @type {SearchFormModel} */
        model: null,

        /** @type {xhr} */
        _currentSearchXHR: null
    })

    modelEvents() {
        return {
            'change:filterByRBTV change:filterByLP change:tags': _.debounce(this._updateSearch, 350)
        }
    }

    set loading(val) {
        this.model.set('loading', val);
    }

    isLoading(val) {
        this.loading = val;
    }

    constructor(options = {}) {
        const model = new SearchFormModel({ cacheKey: 'activities.filter' });

        super(_.extend({ model }, options));
    }

    initialize() {
        var cacheObj = this.model.getCache();

        if(_.isEmpty(cacheObj)) {
            this._currentChannel = Config.channelRBTV;
        } else {
            if(cacheObj.filterByLP) this._currentChannel = Config.channelLP;
            if(cacheObj.filterByRBTV) this._currentChannel = Config.channelRBTV;
        }

        this.listenTo(this, 'search', this._updateSearch);
    }

    onRender() {
        this.stickit();
    }

    onDestroy() {
        this._killScroll();
    }

    renderActivities(nextPageToken = null) {
        this.loading = true;

        if (!nextPageToken) {
            this.collection.reset();
        }

        // Check search
        if (this._search()) {
            return;
        }

        this.getRegion('items').show(
            new ActivitiesList({
                collection: this.collection
            })
        );

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
        if (this.model.get('filterByRBTV')) {
            this._currentChannel = Config.channelRBTV;
        } else if (this.model.get('filterByLP')) {
            this._currentChannel = Config.channelLP;
        }

        // Store model-data to localStorage
        this.model.setCache();

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
        let searchVal     = this.model.get('search');
        let tagCollection = this.model.get('tags');

        searchVal = (searchVal + ' ' + tagCollection.map(tagModel => tagModel.get('title')).join(' ')).trim();

        if (searchVal) {
            this._killScroll();

            /** @type {SearchResults} */
            let view = searchController.prepareSearch(searchVal);

            this.listenTo(view, 'loading:start', () => this.isLoading(true));
            this.listenTo(view, 'loading:stop', () => this.isLoading(false));

            // Attach html
            this.getRegion('items').show(view);

            if (this.$currentSearchXHR) {
                this.$currentSearchXHR.abort();
            }

            this.$currentSearchXHR = view.renderSearchResults(this._currentChannel);
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