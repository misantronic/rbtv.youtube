import React from 'react';
import {Component} from 'react';
import $ from 'jquery';

class Player extends Component {
    constructor(props) {
        super(props);

        this._containerId = 'yt-video-container';
        this.state = {};
    }

    render() {
        return (
            <div className="video-player">
                <div id={this._containerId}/>
            </div>
        );
    }

    componentDidMount() {
        this._YTPlayer = new YT.Player(this._containerId, {
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

        this._setSize();
    }

    _setSize() {
        const $el = $('.video-player');

        let width = $el.css('width', '100%').width();
        let height = width * 0.51;

        if (window.innerWidth <= 768) {
            width = '100%';
            height = window.innerWidth * 0.51;
        }

        $el.css({ width, height });
    }
}

export default Player;
