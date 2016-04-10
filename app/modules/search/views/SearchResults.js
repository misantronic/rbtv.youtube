import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {Video, Videos} from '../../videos/models/Videos'
import beans from '../../../data/beans'
import {props} from '../../decorators'
import app from '../../../application'

class SearchResult extends ItemView {

    @props({
        className: 'item col-xs-12 col-sm-4',

        template: require('../templates/videoItem.ejs'),

        ui: {
            link: '.js-link',
            team: '.js-team',
            duration: '.js-duration'
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
                        let names    = _.iintersection(beans, tags);
                        let maxItems = 4;

                        if (window.innerWidth >= 1200) {
                            maxItems = 5;
                        } else if (window.innerWidth >= 992) {
                            maxItems = 4;
                        } else if (window.innerWidth >= 768) {
                            maxItems = 3;
                        }

                        if (names.length) {
                            let htmlStr = '';
                            for (var i = 0; i < names.length; i++) {
                                let name = names[i].substr(0, 1).toUpperCase() + names[i].substr(1);
                                let Name = name.substr(0, 1).toUpperCase() + name.substr(1);

                                if (i < maxItems) {
                                    htmlStr += `<span class="label label-info js-name" data-name="${Name}">${Name}</span>`;
                                }

                                names[i] = name;
                            }

                            $el.html(htmlStr);

                            if (names.length > maxItems) {
                                let additionalNames = names.slice(maxItems, names.length);

                                $el.append(`<span class="label label-default" data-toggle="tooltip" data-placement="top" title="${additionalNames.join(' ')}">+${additionalNames.length}</span>`)
                                $el.find('[data-toggle="tooltip"]').tooltip();
                            }
                        }
                    }
                }
            },

            '@ui.duration': {
                observe: 'duration',

                update: function ($el, val) {
                    $el.text(Video.humanizeDuration(val));
                }
            }
        }
    })

    onRender() {
        // Remove modal-settings for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.ui.link.removeAttr('data-toggle');
            this.ui.link.removeAttr('data-target');
        }

        this.stickit();

        this.listenTo(app.channel, 'resize', _.debounce(() => {
            this.model.trigger('change:tags');
        }, 100));
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
            _loading: false
        })
    })

    modelEvents() {
        return {
            'change:_loading': (model, val) => {
                if (val) {
                    this.trigger('loading:start');
                } else {
                    this.trigger('loading:stop');
                }
            }
        }
    }

    set loading(val) {
        this.model.set('_loading', val);
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

        xhr.then((data) => {
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
                    this.collection.each((searchModel) => {
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