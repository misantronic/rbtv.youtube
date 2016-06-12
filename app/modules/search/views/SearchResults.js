import $ from 'jquery';
import {CollectionView} from 'backbone.marionette';
import {Model} from 'backbone';
import {VideoCollection} from '../../videos/models/Videos';
import {SearchResult, SearchItemEmpty} from './SearchResult';

const SearchResults = CollectionView.extend({

    className: 'items items-search js-search row',

    childView: SearchResult,

    emptyView: SearchItemEmpty,

    /**
     * Lifecycle methods
     */

    initialize() {
        this.model = new Model({
            _loading: false
        });

        this.listenTo(this.model, 'change:_loading', (model, val) => {
            if (val) {
                this.trigger('loading:start');
            } else {
                this.trigger('loading:stop');
            }
        });
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

    fetch(channelId = null, nextPageToken = null) {
        this.startLoading();

        if (!nextPageToken) {
            this.collection.reset();
        }

        if (channelId) {
            this.collection.setChannelId(channelId);
        }

        const xhr = this.collection
            .setNextPageToken(nextPageToken)
            .fetch();

        xhr.then(collection => {
            this.stopLoading();

            this._fetchVideoDetails(collection);
            this._initScroll();
        });

        return xhr;
    },

    fetchNext() {
        const nextPageToken = this.collection.getNextPageToken();

        if (nextPageToken) {
            this._killScroll();

            this.fetch(null, nextPageToken);
        }
    },

    /**
     * Private methods
     */

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.search', this._onScroll.bind(this));
    },

    _killScroll() {
        $(window).off('scroll.search');
    },

    _fetchVideoDetails(collection) {
        const videoIds = collection.map(model => model.get('videoId'));

        if (videoIds.length) {
            const videoCollection = new VideoCollection();

            videoCollection
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each(searchModel => {
                        const id = searchModel.get('videoId');
                        const videoModel = videoCollection.findWhere({ id });

                        if (videoModel) {
                            // Set tags on activitiy-model
                            searchModel.set({
                                tags: videoModel.get('tags'),
                                duration: videoModel.get('duration')
                            });
                        }
                    });
                });
        }
    },

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y = window.scrollY;

        if (y >= maxY) {
            this.fetchNext();
        }
    }
});

export default SearchResults;
