import React from 'react';
    import $ from 'jquery';

class VideoPlayerComponent extends React.Component {
    constructor(props) {
        super(props);

        this._ytContainerId = 'yt-video-container';

        this.state = {};
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
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'id')) {
            this._updatePlayer();
        }
    }

    _createPlayer() {
        this._YTPlayer = new YT.Player(this._ytContainerId, {
            width: '100%',
            height: '100%',
            videoId: this.props.id
            // events: {
            //     onReady: this._onReady,
            //     onStateChange: this._onStateChange
            // },
            // playerVars: {
            //     start: currentTime
            // }
        });
    }

    _updatePlayer() {
        this._YTPlayer.loadVideoById(this.props.id, /* currentTime: */ 0);
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
}

export default VideoPlayerComponent;
