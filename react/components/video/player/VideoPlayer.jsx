import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

class VideoPlayerComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onReady', '_onStateChange', '_onResize');

        this._ytContainerId = 'yt-video-container';

        this.state = {
            isReady: false,
            autoplay: this.props.autoplay,
            currentTime: this.props.currentTime
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
        this._createPlayer();
        this._setSize();

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
            events: {
                onReady: this._onReady,
                onStateChange: this._onStateChange
            },
            playerVars: {
                start: this.props.currentTime
            }
        });
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

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _onReady() {
        this.setState({ isReady: true }, () => this._updatePlayer());
    }

    _onStateChange(e) {
        // console.log(e);
    }

    _onResize() {
        this._setSize();
    }
}

VideoPlayerComponent.defaultProps = {
    currentTime: 0,
    autoplay: false
};

export default VideoPlayerComponent;
