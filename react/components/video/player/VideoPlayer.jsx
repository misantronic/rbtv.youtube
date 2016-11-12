import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import storage from '../../../utils/storage';

class VideoPlayerComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onReady', '_onStateChange', '_onResize', '_onYT');

        this._ytContainerId = 'yt-video-container';

        const autoplay = this.props.autoplay;
        const isReady = false;

        const videoInfo = storage.getVideoInfo(this.props.id);
        const currentTime = videoInfo.currentTime || 0;

        this.state = {
            isReady,
            autoplay,
            currentTime
        };
    }

    render() {
        this.container = null;

        return (
            <div ref={el => this.container = $(el)} className="video-player">
                <div id={this._ytContainerId}/>
            </div>
        );
    }

    componentDidMount() {
        if (typeof YT === 'undefined' || !YT.Player) {
            window.onYouTubeIframeAPIReady = this._onYT;
        } else {
            this._onYT();
        }

        $(window).on('resize.videoplayer', _.debounce(this._onResize, 200));
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'id') || this._propHasChanged(prevProps, 'autoplay')) {
            this._updatePlayer();
        }
    }

    componentWillUnmount() {
        $(window).off('resize.videoplayer');
    }

    _createPlayer() {
        const videoId = this.props.id;

        this._YTPlayer = new YT.Player(this._ytContainerId, {
            width: '100%',
            height: '100%',
            videoId,
            origin: location.hostname,
            events: {
                onReady: this._onReady,
                onStateChange: this._onStateChange
            },
            playerVars: {
                start: this.props.currentTime
            }
        });

        console.log(this._YTPlayer);
    }

    _updatePlayer() {
        if (!this.state.isReady) return;

        const videoId = this.props.id;
        const method = this.props.autoplay ? 'loadVideoById' : 'cueVideoById';

        this._YTPlayer[method](videoId, this.state.currentTime);
    }

    _setSize() {
        const $el = this.container;

        let width = $el.css('width', '100%').width();
        let height = width * 0.51;

        if (window.innerWidth <= 768) {
            width = '100%';
            height = window.innerWidth * 0.51;
        }

        $el.css({ width, height });
    }

    _setWatched() {
        const videoId = this.props.id;

        storage.update(`${videoId}.info`, { watched: true, currentTime: 0 });
    }

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    /**
     * Event handler
     */

    _onYT() {
        this._createPlayer();
        this._setSize();
    }

    _onReady() {
        this.setState({ isReady: true }, () => this._updatePlayer());
    }

    _onStateChange(e) {
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

    _onPlaying() {
        const videoId = this.props.id;

        // Store player-status
        clearInterval(this._YTPlayerInterval);

        const updateTime = () => {
            const currentTime = Math.round(this._YTPlayer.getCurrentTime());

            storage.update(`${videoId}.info`, { currentTime });
        };

        updateTime();
        this._YTPlayerInterval = setInterval(updateTime, 8000);
    }

    _onEnded() {
        const videoId = this.props.id;

        this._setWatched();

        if (this.props.onEnded) {
            this.onEnded(videoId);
        }
    }
}

VideoPlayerComponent.defaultProps = {
    currentTime: 0,
    autoplay: false
};

export default VideoPlayerComponent;
