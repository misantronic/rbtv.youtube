import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment';
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {localStorage} from '../../../utils'
import app from '../../../application'
import {props} from '../../decorators'

class PlaylistItem extends ItemView {

    @props({
        className: 'playlist-item js-playlist-item',

        template: require('../templates/playlistItem.ejs'),

        ui: {
            link: '.js-link'
        },

        bindings: {
            ':el': {
                classes: {
                    'watched': '_watched'
                }
            }
        },

        triggers: {
            'click @ui.link': 'link:clicked'
        }
    })

    initialize() {
        const videoId = this.model.get('videoId');
        const watched = !!localStorage.get(`${videoId}.info`, 'watched');

        if (watched) {
            this.model.set('_watched', true);
        }
    }

    onRender() {
        this.$el.attr('data-videoid', this.model.get('videoId'));

        this.stickit();
    }
}

class PlaylistItems extends CompositeView {

    @props({
        className: 'layout-playlists-items',

        model: new Model({
            _search: '',
            _searchDate: null,
            videoId: null,
            _loading: false
        }),

        ui: {
            search: '.js-search',
            datepicker: '.js-datepicker',
            loader: '.js-loader'
        },

        childView: PlaylistItem,

        childViewContainer: '.js-playlist-items',

        childEvents: {
            'link:clicked': '_onClickLink'
        },

        template: require('../templates/playlistItems.ejs')
    })

    set videoId(val) {
        // Workaround: Do not affect the users back-button-history
        this.model.set('videoId', val, { silent: true });

        this._highlightVideo();
        this._routeToVideo(true);
    }

    set loading(val) {
        this.model.set('_loading', val);
    }

    /**
     * @returns {{search: String}}
     */
    get playlistFilter() {
        return {
            search: this.model.get('_search'),
            date: this.model.get('_searchDate')
        }
    }

    bindings() {
        return {
            '@ui.search': '_search',

            '@ui.datepicker': {
                observe: '_searchDate',
                onSet: (val) => {
                    return val ? moment(val, 'DD.MM.YYYY') : null;
                }
            },

            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            }
        }
    }

    modelEvents() {
        return {
            'change:videoId': () => {
                this._highlightVideo();
                this._routeToVideo();
            },

            'change:_search change:_searchDate': _.debounce(() => {
                this._searchCollection();
                this._highlightVideo();
            }, 500)
        }
    }

    initialize() {
        this.videoId = null;
    }

    onRender() {
        this.listenTo(app.channel, 'resize', _.debounce(this._onResize, 100));

        this.stickit();

        scrollTo(0, window.innerWidth > 768 ? 300 : 0);
    }

    _searchCollection() {
        const filter = this.playlistFilter;

        this.collection.search(filter);
    }

    _onClickLink(playlistItem) {
        this.model.set('videoId', playlistItem.model.get('videoId'), { silent: true });

        this._highlightVideo();
        this._routeToVideo(false);
    }

    _highlightVideo() {
        if (!this.$childViewContainer) return;

        this.$childViewContainer.find('.js-playlist-item').removeClass('active');

        const $videoId = this.$childViewContainer.find('[data-videoid="' + this.model.get('videoId') + '"]');

        $videoId.addClass('active');

        // Scroll
        this.$childViewContainer
            .animate({
                scrollTop: ($videoId.index() - 1) * 65
            }, 250);
    }

    /**
     * @param {Boolean} replaceState
     * @private
     */
    _routeToVideo(replaceState) {
        var videoId = this.model.get('videoId');

        if (!videoId) return;

        const currentPlaylistItem = this.collection.getCurrentPlaylistItem(this.model.get('videoId'));

        app.navigate(
            `playlists/playlist/${currentPlaylistItem.get('playlistId')}/video/${currentPlaylistItem.get('videoId')}`,
            { replace: replaceState }
        );
    }

    _onResize() {
        var playlistItems = this.$('.js-playlist-items');

        if (window.innerWidth <= 768) {
            var top = playlistItems.offset().top;

            playlistItems.css('height', window.innerHeight - top);
        } else {
            playlistItems.removeAttr('style');
        }
    }

}

export {PlaylistItem, PlaylistItems}
export default PlaylistItems