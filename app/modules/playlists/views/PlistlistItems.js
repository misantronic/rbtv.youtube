import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment';
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'
import {localStorage} from '../../../utils'
import app from '../../../application'

class PlaylistItem extends ItemView {
    get className() {
        return 'playlist-item js-playlist-item';
    }

    get template() {
        return require('../templates/playlistItem.ejs');
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    bindings() {
        return {
            ':el': {
                classes: {
                    'watched': '_watched'
                }
            }
        }
    }

    triggers() {
        return {
            'click @ui.link': 'link:clicked'
        }
    }

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

let autoplay = false;

export default class PlaylistItems extends CompositeView {

    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _search: '',
                _searchDate: null,
                videoId: null
            })
        });

        super(options);
    }

    ui() {
        return {
            search: '.js-search',
            datepicker: '.js-datepicker'
        }
    }

    get childView() {
        return PlaylistItem;
    }

    get childViewContainer() {
        return '.js-playlist-items'
    }

    get template() {
        return require('../templates/playlistItems.ejs');
    }

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

    childEvents() {
        return {
            'link:clicked': '_onClickLink'
        }
    }

    modelEvents() {
        return {
            'change:videoId': '_highlightVideo _routeToVideo',

            'change:_search change:_searchDate': _.debounce(() => {
                this._searchCollection();
                this._highlightVideo();
            }, 50)
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

    initialize() {
        this._playerInterval = 0;
    }

    onRender() {
        this.ui.datepicker.datepicker({
            format: 'dd.mm.yyyy',
            autoclose: true,
            weekStart: 1
        });

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

    _routeToVideo() {
        const currentPlaylistItem = this.collection.getCurrentPlaylistItem(this.model.get('videoId'));

        app.navigate(`playlists/playlist/${currentPlaylistItem.get('playlistId')}/video/${currentPlaylistItem.get('videoId')}`);
    }

    _videoPlay() {
        clearInterval(this._playerInterval);

        const videoId = this.model.get('videoId');

        if (videoId) {
            $('#yt-video-container').replaceWith('<div id="yt-video-container"></div>');

            this._player = new YT.Player('yt-video-container', {
                height: '390',
                width: '640',
                videoId: videoId,
                events: {
                    'onReady': this._onVideoReady.bind(this),
                    'onStateChange': this._onVideoStateChange.bind(this)
                }
            });
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

}