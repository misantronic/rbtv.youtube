import _ from 'underscore'
import $ from 'jquery'
import {LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import {props} from '../../decorators'
import {localStorage} from '../../../utils'
import channels from '../../../channels'

class VideoPlayer extends LayoutView {
    constructor(options = {}) {
        options.model = new Model({
            loading: false,
            autoplay: false
        });

        super(options);

        this._YTPlayerInterval = 0;
        this._YTPlayer = null;
    }

    @props({
        className: 'video-container',

        template: require('../templates/video-player.ejs'),

        channels: function () {
            return {
                app: {
                    resize: _.debounce(this._onResize, 100)
                },
                comments: {
                    'video:seek': '_onSeek'
                }
            }
        }
    })

    modelEvents() {
        return {
            'change:id': '_initVideo'
        }
    }

    set videoId(val) {
        this.model.set('id', val);
    }

    set autoplay(val) {
        this.model.set('autoplay', val)
    }

    initialize() {
        _.bindAll(this, '_onReady', '_onStateChange');
    }

    onRender() {
        this.stickit();
    }

    onShow() {
        this.videoId = this.getOption('videoId');

        this._setSize();
    }

    _initVideo() {
        clearInterval(this._YTPlayerInterval);

        if (this._YTPlayer) {
            this._usePlayer();
        } else {
            this._createPlayer();
        }
    }

    _createPlayer() {
        const videoId = this.model.id;

        if (!videoId) return;

        let containerId = 'yt-video-container';
        let $container = this.$('#' + containerId);
        let height = $container.css('height', 'auto').height();
        let $videoContainer = $('<div id="' + containerId + '"></div>');

        if (height) {
            $videoContainer.css('height', height)
        }

        $container.replaceWith($videoContainer);

        var setupPlayer = function () {
            const videoInfo = localStorage.get(`${videoId}.info`) || {};
            const currentTime = videoInfo.currentTime || 0;

            this._YTPlayer = new YT.Player(containerId, {
                width: '100%',
                height: '100%',
                videoId,
                events: {
                    onReady: this._onReady,
                    onStateChange: this._onStateChange
                },
                playerVars: {
                    start: currentTime
                }
            });

            this._setSize();
        }.bind(this);

        if (typeof YT === 'undefined' || !YT.Player) {
            window.onYouTubeIframeAPIReady = setupPlayer;
        } else {
            setupPlayer();
        }
    }

    _usePlayer() {
        const videoId = this.model.id;

        if (!videoId) return;

        // currentTime
        const videoInfo = localStorage.get(`${videoId}.info`) || {};
        const currentTime = videoInfo.currentTime || 0;

        if (this.model.get('autoplay')) {
            this._YTPlayer.loadVideoById(videoId, currentTime);
        } else {
            this._YTPlayer.cueVideoById(videoId, currentTime);
        }

        this.model.set('autoplay', false);
    }

    _onPlaying() {
        const videoId = this.model.id;

        // Store player-status
        clearInterval(this._YTPlayerInterval);

        const updateTime = () => {
            const currentTime = Math.round(this._YTPlayer.getCurrentTime());

            localStorage.update(`${videoId}.info`, {currentTime});
        };

        updateTime();
        this._YTPlayerInterval = setInterval(updateTime, 8000);
    }

    _onEnded() {
        const videoId = this.model.id;

        this.trigger('video:ended', videoId);
    }

    _onReady(e) {
        if (_.isNull(e.data)) {
            this._onResize();
        }
    }

    _onStateChange(e) {
        const videoId = this.model.id;

        switch (e.data) {
            case YT.PlayerState.PLAYING:
                this._onPlaying();
                break;
            case YT.PlayerState.ENDED:
                this._onEnded();
                break;
        }
    }

    /**
     * @param {Number} seconds
     * @private
     */
    _onSeek(seconds) {
        if (this._YTPlayer) {
            // Focus video player
            $('html, body').animate({
                scrollTop: this.$el.offset().top
            }, 500, () => this._YTPlayer.seekTo(seconds, true));
        }
    }

    _onResize() {
        this._setSize();
    }

    _setSize() {
        let width = this.$el.css('width', '100%').width();
        let height = width * 0.51;

        if (window.innerWidth <= 768) {
            width = '100%';
            height = window.innerWidth * 0.51;
        }

        this.$el.css({width, height});
    }
}

export default VideoPlayer