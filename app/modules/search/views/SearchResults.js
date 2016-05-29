import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, LayoutView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {Video, Videos} from '../../videos/models/Videos'
import beans from '../../../data/beans'
import {props} from '../../decorators'
import {localStorage} from '../../../utils'
import AutocompleteView from './Autocomplete'
import AutocompleteCollection from '../models/Autocomplete'
import channels from '../../../channels'

class SearchResult extends LayoutView {

    @props({
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
                update: function ($el, tags) {
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

                            return tag.split(' ')[0]
                        });

                        // Match names
                        let names = _.iintersection(_.map(beans, bean => bean.title), tags);

                        if (names.length) {
                            var autocompleteView = new AutocompleteView({
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

        behaviors: function () {
            return {
                Radio: {
                    app: {
                        resize: _.debounce(this._onResize, 100)
                    }
                }
            }
        }
    })

    initialize() {
        this._initWatched();
    }

    onRender() {
        this._initTooltip();

        this.stickit();
    }

    onDestroy() {
        this.$('[data-toggle="tooltip"]').tooltip('destroy')
    }

    _onResize() {
        this.model.trigger('change:tags');
    }

    _initTooltip() {
        this.$('[data-toggle="tooltip"]').tooltip({
            delay: { show: 250, hide: 100 }
        });
    }

    _initWatched() {
        const videoId = this.model.get('videoId');
        const watched = !!localStorage.get(`${videoId}.info`, 'watched');

        this.model.set('_watched', watched);
    }
}

class SearchItemEmpty extends ItemView {
    get className() {
        return 'item item-empty text-center col-xs-12';
    }

    get template() {
        return require('../templates/empty.ejs');
    }
}

class SearchResults extends CollectionView {

    @props({
        className: 'items items-search js-search row',

        childView: SearchResult,

        emptyView: SearchItemEmpty,

        model: new Model({
            loading: false
        })
    })

    modelEvents() {
        return {
            'change:loading': (model, val) => {
                if (val) {
                    this.trigger('loading:start');
                } else {
                    this.trigger('loading:stop');
                }
            }
        }
    }

    set loading(val) {
        this.model.set('loading', val);
    }

    onDestroy() {
        this._killScroll();
    }

    renderSearchResults(channelId = null, nextPageToken = null) {
        this.loading = true;

        if (!nextPageToken) {
            this.collection.reset();
        }

        if (channelId) {
            this.collection.setChannelId(channelId);
        }

        this._animateDelay = 0;

        let xhr = this.collection
            .setNextPageToken(nextPageToken)
            .fetch();

        xhr.then(data => {
            this.loading = false;

            this._fetchVideoDetails(data);
            this._initScroll();
        });

        return xhr;
    }

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.search', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.search');
    }

    _fetchNext() {
        const nextPageToken = this.collection.nextPageToken;

        if (nextPageToken) {
            this._killScroll();

            this.renderSearchResults(null, nextPageToken);
        }
    }

    _fetchVideoDetails(searchData) {
        let videoIds = _.map(searchData.items, modelData => {
            return modelData.id.videoId;
        });

        if (videoIds.length) {
            let videos = new Videos();

            videos
                .setVideoIds(videoIds)
                .fetch()
                .done(() => {
                    this.collection.each(searchModel => {
                        let id         = searchModel.get('videoId');
                        let videoModel = videos.findWhere({ id });

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
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._fetchNext();
        }
    }
}

export {SearchResult}
export default SearchResults