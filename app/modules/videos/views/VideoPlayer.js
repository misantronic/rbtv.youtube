import _ from 'underscore'
import $ from 'jquery'
import {LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import {props} from '../../decorators'
import {localStorage} from '../../../utils'
import app from '../../../application'

class VideoPlayer extends LayoutView {
    constructor(options = {}) {
        options.model = new Model({
            _loading: false,
            _autoplay: false
        });

        super(options);

        this._YTPlayerInterval = 0;
        this._YTPlayer         = null;
    }

    @props({
        className: 'video-container',

        template: require('../templates/video-player.ejs')
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
        this.model.set('_autoplay', val)
    }

    initialize() {
        _.bindAll(this, '_onReady', '_onStateChange');

        this.listenTo(app.channel, 'resize', _.debounce(this._onResize, 100));
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

        let containerId     = 'yt-video-container';
        let $container      = this.$('#' + containerId);
        let height          = $container.css('height', 'auto').height();
        let $videoContainer = $('<div id="' + containerId + '"></div>');

        if (height) {
            $videoContainer.css('height', height)
        }

        $container.replaceWith($videoContainer);

        var setupPlayer = function() {
            this._YTPlayer = new YT.Player(containerId, {
                width: '100%',
                height: '100%',
                videoId,
                events: {
                    'onReady': this._onReady,
                    'onStateChange': this._onStateChange
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
        const videoInfo   = localStorage.get(`${videoId}.info`) || {};
        const currentTime = videoInfo.currentTime || 0;

        if (this.model.get('_autoplay')) {
            this._YTPlayer.loadVideoById(videoId, currentTime);
        } else {
            this._YTPlayer.cueVideoById(videoId, currentTime);
        }

        this.model.set('_autoplay', false);
    }

    _onPlaying() {
        const videoId = this.model.id;

        // Store player-status
        clearInterval(this._YTPlayerInterval);

        const updateTime = () => {
            const currentTime = Math.round(this._YTPlayer.getCurrentTime());

            localStorage.update(`${videoId}.info`, { currentTime });
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

    _onResize() {
        this._setSize();
    }

    _setSize() {
        let width  = this.$el.css('width', '100%').width();
        let height = width * 0.51;

        if (window.innerWidth <= 768) {
            width  = '100%';
            height = window.innerWidth * 0.51;
        }

        this.$el.css({ width, height });
    }
}

export default VideoPlayer