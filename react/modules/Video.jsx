import React from 'react';
import {Component} from 'react';
import VideoPlayer from '../components/video/player/VideoPlayer';
import VideoDetails from '../components/video/details/VideoDetails';

class VideoModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoId: this.props.routeParams.id
        };
    }

    render() {
        const videoId = this.state.videoId;

        return (
            <div className="module-video">
                <VideoPlayer id={videoId} autoplay={false}/>
                <div className="details-wrapper">
                    <VideoDetails id={videoId} />
                </div>
            </div>
        );
    }
}

export default VideoModule;
