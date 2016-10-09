import _ from 'underscore';
import {CompositeView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import {localStorage} from '../../../utils';
import app from '../../../application';
import {props} from '../../decorators';

const PlaylistItem = ItemView.extend({

    className: 'playlist-item js-playlist-item',

    template: require('../templates/playlist-item.ejs'),

    ui: {
        link: '.js-link'
    },

    bindings: {
        ':el': {
            classes: {
                'watched': '_watched'
            },

            attributes: [
                {
                    name: 'data-videoId',
                    observe: 'videoId'
                }
            ]
        }
    },

    triggers: {
        'click @ui.link': 'link:clicked'
    },

    initialize() {
        const videoId = this.model.get('videoId');
        const watched = !!localStorage.get(`${videoId}.info`, 'watched');

        if (watched) {
            this.model.set('_watched', true);
        }
    },

    onRender() {
        this.stickit();
    }
});

class PlaylistItems extends CompositeView {

    @props({
        className: 'layout-playlists-items',

        model: new Model({
            search: '',
            videoId: null,
            _loading: false
        }),

        ui: {
            search: '.js-search',
            loader: '.js-loader'
        },

        childView: PlaylistItem,

        childViewContainer: '.js-playlist-items',

        childEvents: {
            'link:clicked': '_onClickLink'
        },

        template: require('../templates/playlist-items.ejs')
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
            search: this.model.get('search')
        };
    }

    bindings() {
        return {
            '@ui.search': 'search',

            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            }
        };
    }

    modelEvents() {
        return {
            'change:videoId': () => {
                this._highlightVideo();
                this._routeToVideo();
            },

            'change:search': _.debounce(() => {
                this._searchCollection();
                this._highlightVideo();
            }, 500)
        };
    }

    initialize() {
        this.videoId = null;
    }

    onRender() {
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
        const videoId = this.model.get('videoId');

        if (!videoId) return;

        const currentPlaylistItem = this.collection.getCurrentPlaylistItem(this.model.get('videoId'));

        app.navigate(
            `playlists/playlist/${currentPlaylistItem.get('playlistId')}/video/${currentPlaylistItem.get('videoId')}`,
            { replace: replaceState }
        );
    }
}

export {PlaylistItem, PlaylistItems};
export default PlaylistItems;
