import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import Config from '../../../Config'

class SearchItem extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-4';
    }

    get template() {
        return require('../../activities/templates/activity.ejs');
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

/**
 * @class SearchView
 */
class Search extends CollectionView {
    constructor(options = {}) {
        _.defaults(options, {
            model: new Model({
                _filterByRBTV: true,
                _filterByLP: false,
                _loading: false,
                _search: ''
            })
        });

        super(options);
    }

    events() {
        return {
            'click @ui.link': '_onCLickLink'
        }
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    get className() {
        return 'items items-search js-search row'
    }

    get childView() {
        return SearchItem;
    }

    onRender() {
        this._initScroll();

        this.stickit();
    }

    onDestroy() {
        this._killScroll();
    }

    renderSearch(channelId, nextPageToken = null) {
        this.model.set('_loading', true);

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

    _onCLickLink(e) {
        const $link   = $(e.currentTarget);
        const videoId = $link.data('videoid');
        const title   = $link.data('title');

        // this.$('#modal-activities-body').replaceWith('<div id="modal-activities-body"></div>');
        //
        // this.$('.js-modal-activities')
        //     .one('shown.bs.modal', () => {
        //         this._player = new YT.Player('modal-activities-body', {
        //             height: '390',
        //             width: '100%',
        //             videoId: videoId
        //         });
        //     })
        //     .find('.js-modal-title').text(title);
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

export default Search