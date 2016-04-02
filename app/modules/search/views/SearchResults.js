import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'

class SearchResult extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-4';
    }

    get template() {
        return require('../templates/videoItem.ejs');
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

class SearchItemEmpty extends ItemView {
    get className() {
        return 'item item-empty text-center col-xs-12';
    }

    get template() {
        return require('../templates/empty.ejs');
    }
}

/**
 * @class SearchResultsView
 */
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

    onRender() {
        this._initScroll();
    }

    onDestroy() {
        this._killScroll();
    }

    renderSearch(channelId = null, nextPageToken = null) {
        this.loading = true;

        if (!nextPageToken) {
            this.collection.reset();
        }

        if (channelId) {
            this.collection.setChannelId(channelId);
        }

        return this.collection
            .setNextPageToken(nextPageToken)
            .fetch()
            .then(() => {
                this.loading = false;

                this.render();
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
            this.renderSearch(null, nextPageToken);
        }
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._killScroll();
            this._fetchNext();
        }
    }
}

export default SearchResults