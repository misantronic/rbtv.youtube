import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment';
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {localStorage} from '../../../utils'
import app from '../../../application'
import {props} from '../../decorators'

let autoplay = false;

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
        className: 'layout-playlists-items row',

        model: new Model({
            _search: '',
            _searchDate: null,
            videoId: null
        }),

        ui: {
            search: '.js-search',
            datepicker: '.js-datepicker'
        },

        childView: PlaylistItem,

        childViewContainer: '.js-playlist-items',

        childEvent: {
            'link:clicked': '_onClickLink'
        },

        template: require('../templates/playlistItems.ejs')
    })

    set videoId(val) {
        this.model.set('videoId', val);
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
            '.js-video-container': {
                observe: 'videoId',
                update: _.debounce(this._videoPlay, 500)
            },

            '@ui.search': '_search',

            '@ui.datepicker': {
                observe: '_searchDate',
                onSet: (val) => {
                    return val ? moment(val, 'DD.MM.YYYY') : null;
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
        this._playerInterval = 0;
    }

    onRender() {
        this.ui.datepicker.datepicker({
            format: 'dd.mm.yyyy',
            autoclose: true,
            weekStart: 1
        });

        this.listenTo(app.channel, 'resize', _.debounce(this._onResize, 100));

        this.stickit();
    }

    _searchCollection() {
        const filter = this.playlistFilter;

        this.collection.search(filter);
    }

    _onClickLink(playlistItem) {
        this.videoId = playlistItem.ui.link.data('videoid');
    }

    _highlightVideo() {
        this.$childViewContainer.find('.js-playlist-item').removeClass('active');

        const $videoId = this.$childViewContainer.find('[data-videoid="' + this.model.get('videoId') + '"]');

        $videoId.addClass('active');

        // Scroll
        this.$childViewContainer
            .animate({
                scrollTop: ($videoId.index() - 1) * 65
            }, 250);
    }

    _routeToVideo(replaceState = false) {
        const currentPlaylistItem = this.collection.getCurrentPlaylistItem(this.model.get('videoId'));

        app.navigate(
            `playlists/playlist/${currentPlaylistItem.get('playlistId')}/video/${currentPlaylistItem.get('videoId')}`,
            { replace: replaceState }
        );
    }

    _videoPlay() {
        clearInterval(this._playerInterval);

        const videoId = this.model.get('videoId');

        if (videoId) {
            if (this._player) {
                this._player.loadVideoById(videoId, 0);
            } else {
                $('#yt-video-container').replaceWith('<div id="yt-video-container"></div>');

                this._player = new YT.Player('yt-video-container', {
                    width: 200,
                    height: 200,
                    videoId: videoId,
                    events: {
                        'onReady': this._onVideoReady.bind(this),
                        'onStateChange': this._onVideoStateChange.bind(this)
                    }
                });

                this._videoSetSize();
            }
        }
    }

    _videoBeforePlay() {
        const videoId = this.model.get('videoId');

        // currentTime
        const videoInfo = localStorage.get(`${videoId}.info`);

        if (videoInfo && videoInfo.currentTime) {
            this._player.seekTo(videoInfo.currentTime);
        }
    }

    _videoPlaying() {
        const videoId = this.model.get('videoId');

        // Store player-status
        clearInterval(this._playerInterval);

        const updateCurrentTime = () => {
            const currentTime = Math.round(this._player.getCurrentTime());

            localStorage.update(`${videoId}.info`, { currentTime });
        };

        updateCurrentTime();
        this._playerInterval = setInterval(updateCurrentTime, 8000);
    }

    _videoEnded() {
        const videoId = this.model.get('videoId');

        // Mark as watched
        this.collection.getCurrentPlaylistItem(videoId).set('_watched', true);
        localStorage.update(`${videoId}.info`, { watched: true, currentTime: 0 });

        // Play next
        const nextPlaylistItem = this.collection.getNextPlaylistItem(videoId);

        if (nextPlaylistItem) {
            const nextVideoId = nextPlaylistItem.get('videoId');

            // Reset currentTime
            localStorage.update(`${nextVideoId}.info`, { currentTime: 0 });

            // Set new videoId
            this.videoId = nextVideoId;

            // Start video automatically
            autoplay = true;
        }
    }

    _onVideoReady(e) {
        if (_.isNull(e.data)) {
            // autoplay
            if (autoplay) {
                this._player.playVideo();

                autoplay = false;
            }

            this._onResize();
        }
    }

    _videoSetSize() {
        if (this._player) {
            let width  = 640;
            let height = width * 0.51;

            if (window.innerWidth <= 768) {
                width  = '100%';
                height = window.innerWidth * 0.51;
            }

            this._player.setSize(width, height);
        }
    }

    _onVideoStateChange(e) {
        const videoId = this.model.get('videoId');

        switch (e.data) {
            case YT.PlayerState.UNSTARTED:
                this._videoBeforePlay();
                break;
            case YT.PlayerState.PLAYING:
                this._videoPlaying();
                break;
            case YT.PlayerState.ENDED:
                this._videoEnded();
                break;
        }
    }

    _onResize() {
        this._videoSetSize();

        var playlistItems = this.$('.js-playlist-items');

        if (window.innerWidth <= 768) {
            var top = playlistItems.offset().top;

            playlistItems.css('height', window.innerHeight - top);
        } else {
            playlistItems.removeAttr('style');
        }
    }

}

export default PlaylistItems