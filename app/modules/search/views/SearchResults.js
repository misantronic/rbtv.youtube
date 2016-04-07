import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import VideoCollection from '../../videos/models/Videos'
import beans from '../../../data/beans'
import {props} from '../../decorators'

class SearchResult extends ItemView {

    @props({
        className: 'item col-xs-12 col-sm-4',

        template: require('../templates/videoItem.ejs'),

        ui: {
            link: '.js-link'
        },

        bindings: {
            '.js-team': {
                observe: 'tags',
                update: function ($el, tags) {
                    if (tags) {
                        // Map only first names
                        tags = _.map(tags, (tag) => {
                            if (tag.toLowerCase() === 'daniel budiman') {
                                return 'budi';
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

                                if (i < maxItems) {
                                    htmlStr += `<span class="label label-info">${name.substr(0, 1).toUpperCase()}${name.substr(1)}</span>`;
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

        $(window).on('resize.' + this.cid, _.debounce(() => {
            this.model.trigger('change:tags');
        }, 100));
    }

    onDestroy() {
        $(window).off('resize.' + this.cid);
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
    constructor(options = {}) {
        _.defaults(options, {
            model: new Model({
                _loading: false
            })
        });

        super(options);
    }

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

    get className() {
        return 'items items-search js-search row'
    }

    get childView() {
        return SearchResult;
    }

    get emptyView() {
        return SearchItemEmpty;
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

        return this.collection
            .setNextPageToken(nextPageToken)
            .fetch()
            .then((data) => {
                this.loading = false;

                this._fetchVideoDetails(data);
                this._initScroll();
            })
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
        let videoIds = _.map(searchData.items, (searchItemData) => {
            return searchItemData.id.videoId;
        });

        let videoCollection = new VideoCollection();

        videoCollection
            .setVideoIds(videoIds)
            .fetch()
            .done(() => {
                this.collection.each((searchModel) => {
                    let id         = searchModel.get('videoId');
                    let videoModel = videoCollection.findWhere({ id });

                    if (videoModel) {
                        // Set tags on activitiy-model
                        searchModel.set(
                            'tags',
                            videoModel.get('tags')
                        );
                    }
                });
            });
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