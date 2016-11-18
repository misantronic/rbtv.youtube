import $ from 'jquery';
import _ from 'underscore';
import {LayoutView} from 'backbone.marionette';
import ActivitiesList from './ActivitiesList';
import SearchFormModel from '../../search/models/SearchForm';
import Config from '../../../Config';
import SearchResultsCollection from '../../search/models/SearchResults';
import SearchResultsView from '../../search/views/SearchResults';
import shows from '../../../data/shows';
import VideoCollection from '../../videos/models/Videos';

const Activities = LayoutView.extend({

    className: 'layout-activities',

    regions: {
        items: '.region-items'
    },

    template: require('../templates/activities.ejs'),

    behaviors: {
        BtnToTop: {},
        Search: {
            container: '.js-search-container'
        },
        Loader: {}
    },

    ui: {
        link: '.js-link',
        btnPlaylist: '.js-playlist'
    },

    bindings: {
        '@ui.btnPlaylist': {
            classes: {
                show: {
                    observe: 'search',
                    onGet(title) {
                        const tagObj = _.findWhere(shows, { title });

                        if (tagObj && tagObj.playlistId) {
                            this.ui.btnPlaylist
                                .attr('href', `#playlists/playlist/${tagObj.playlistId}`)
                                .text(`Zur '${tagObj.title}' Playlist`);

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
    _currentSearchXHR: null,

    modelEvents() {
        return {
            'change:filterByRBTV change:filterByLP change:tags': _.debounce(this._updateSearch, 350)
        };
    },

    /**
     * Lifecycle methods
     */

    constructor(options = {}) {
        const model = new SearchFormModel({ cacheKey: 'activities.filter' });

        options = _.extend({ model }, options);

        if (options.disableSearch) {
            this.behaviors = _.omit(this.behaviors, 'Search');
        }

        if (options.disableBtnToTop) {
            this.behaviors = _.omit(this.behaviors, 'BtnToTop');
        }

        LayoutView.call(this, options);
    },

    initialize() {
        const cacheObj = this.model.getCache();

        if (_.isEmpty(cacheObj)) {
            this._currentChannel = Config.channelRBTV;
        } else {
            if (cacheObj.filterByLP) this._currentChannel = Config.channelLP;
            if (cacheObj.filterByRBTV) this._currentChannel = Config.channelRBTV;
        }

        this.listenTo(this, 'search', this._updateSearch);
    },

    onRender() {
        this.stickit();
    },

    onShow() {
        this._updateSearch();
    },

    onDestroy() {
        this._killScroll();
    },

    /**
     * Public methods
     */

    startLoading() {
        this.model.set('_loading', true);
    },

    stopLoading() {
        this.model.set('_loading', false);
    },

    /**
     * Private methods
     */

    _fetch(nextPageToken = null) {
        this.startLoading();

        // Check search
        if (this._search()) {
            return;
        }

        if (!nextPageToken) {
            this.collection.reset();

            this.getRegion('items').show(
                new ActivitiesList({
                    collection: this.collection
                })
            );
        }

        this.collection
            .setNextPageToken(nextPageToken)
            .setChannelId(this._currentChannel)
            .fetch()
            .done(collection => {
                this.stopLoading();
                this._initScroll();
                this._fetchVideoDetails(collection);
            });
    },

    _fetchNext() {
        const nextPageToken = this.collection.getNextPageToken();

        if (nextPageToken) {
            this._killScroll();

            this._fetch(nextPageToken);
        }
    },

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
            this._fetch();
        }
    },

    /**
     * @returns {String}
     * @private
     */
    _search() {
        let searchVal = this.model.get('search');

        const tagCollection = this.model.get('tags');

        searchVal = ((tagCollection.map(tagModel => tagModel.get('title')).join(' ')) + ' ' + searchVal).trim();

        if (searchVal) {
            this._killScroll();

            const collection = new SearchResultsCollection()
                .setNextPageToken(null)
                .setQ(searchVal);

            const searchResultsView = new SearchResultsView({ collection });

            this.listenTo(searchResultsView, 'loading:start', this.startLoading);
            this.listenTo(searchResultsView, 'loading:stop', this.stopLoading);

            // Attach html
            this.getRegion('items').show(searchResultsView);

            if (this._currentSearchXHR) {
                this._currentSearchXHR.abort();
            }

            this._currentSearchXHR = searchResultsView.fetch(this._currentChannel);
        }

        return searchVal;
    },

    _fetchVideoDetails(collection) {
        const videoIds = collection.map(model => model.get('videoId'));

        if (videoIds.length) {
            const videoCollection = new VideoCollection();

            videoCollection
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each(activityModel => {
                        const id = activityModel.get('videoId');
                        const videoModel = videoCollection.findWhere({ id });

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
    },

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.activities', this._onScroll.bind(this));
    },

    _killScroll() {
        $(window).off('scroll.activities');
    },

    /**
     * Event handler
     */

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y = window.scrollY;

        if (y >= maxY) {
            this._fetchNext();
        }
    }
});

export default Activities;
