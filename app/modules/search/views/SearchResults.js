import $ from 'jquery';
import _ from 'underscore';
import {CollectionView, LayoutView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import {Video, Videos} from '../../videos/models/Videos';
import beans from '../../../data/beans';
import {props} from '../../decorators';
import {localStorage} from '../../../utils';
import AutocompleteView from './Autocomplete';
import AutocompleteCollection from '../models/Autocomplete';
import channels from '../../../channels';

const SearchResult = LayoutView.extend({

    className: 'item col-xs-12 col-sm-4',

    template: require('../templates/video-item.ejs'),

    ui: {
        link: '.js-link',
        team: '.region-team',
        duration: '.js-duration'
    },

    regions: {
        team: '.region-team'
    },

    bindings: {
        '@ui.team': {
            observe: 'tags',
            update($el, tags) {
                if (tags) {
                    // Map only first names
                    tags = _.map(tags, (tag) => {
                        // Special cases
                        if (tag.toLowerCase() === 'daniel budiman') {
                            return 'budi';
                        }

                        // Special cases
                        if (tag.toLowerCase() === 'eddy') {
                            return 'etienne';
                        }

                        return tag.split(' ')[0];
                    });

                    // Match names
                    const names = _.iintersection(_.map(beans, bean => bean.title), tags);

                    if (names.length) {
                        const autocompleteView = new AutocompleteView({
                            collection: new AutocompleteCollection(
                                _.map(names, name => ({
                                    title: name.substr(0, 1).toUpperCase() + name.substr(1)
                                }))
                            )
                        });

                        this.getRegion('team').show(autocompleteView);

                        this.listenTo(autocompleteView, 'childview:link:selected', view => channels.app.trigger('tag:selected', view));
                    }
                }
            }
        },

        '@ui.duration': {
            observe: 'duration',

            update: ($el, val) => {
                $el.text(Video.humanizeDuration(val));
            }
        },

        ':el': {
            classes: {
                'watched': '_watched'
            }
        }
    },

    initialize() {
        this._initWatched();
    },

    onRender() {
        this._initTooltip();

        this.stickit();
    },

    onDestroy() {
        this.$('[data-toggle="tooltip"]').tooltip('destroy');
    },

    _initTooltip() {
        this.$('[data-toggle="tooltip"]').tooltip({
            delay: { show: 250, hide: 100 }
        });
    },

    _initWatched() {
        const videoId = this.model.get('videoId');
        const watched = !!localStorage.get(`${videoId}.info`, 'watched');

        this.model.set('_watched', watched);
    }
});

const SearchItemEmpty = ItemView.extend({
    className: 'item item-empty text-center col-xs-12',

    template: require('../templates/empty.ejs')
});

const SearchResults = CollectionView.extend({

    className: 'items items-search js-search row',

    childView: SearchResult,

    emptyView: SearchItemEmpty,

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

    startLoading() {
        this.model.set('_loading', true);
    },

    stopLoading() {
        this.model.set('_loading', false);
    },

    onDestroy() {
        this._killScroll();
    },

    renderSearchResults(channelId = null, nextPageToken = null) {
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

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.search', this._onScroll.bind(this));
    },

    _killScroll() {
        $(window).off('scroll.search');
    },

    _fetchNext() {
        const nextPageToken = this.collection.nextPageToken;

        if (nextPageToken) {
            this._killScroll();

            this.renderSearchResults(null, nextPageToken);
        }
    },

    _fetchVideoDetails(searchCollection) {
        const videoIds = searchCollection.map(model => {
            return model.get('videoId');
        });

        if (videoIds.length) {
            const videos = new Videos();

            videos
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each(searchModel => {
                        const id = searchModel.get('videoId');
                        const videoModel = videos.findWhere({ id });

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
            this._fetchNext();
        }
    }
});

export {SearchResult};
export default SearchResults;
