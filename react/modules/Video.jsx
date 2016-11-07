import React from 'react';
import {Component} from 'react';
import VideoPlayer from '../components/videoplayer/VideoPlayer';

class VideoModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoId: null
        };
    }

    render() {
        return (
            <div className="module-video">
                <VideoPlayer id={this.state.videoId} />
            </div>
        );
    }
}

export default VideoModule;
