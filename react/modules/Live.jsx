import React from 'react';
import {Component} from 'react';
import VideoDetails from '../components/video/details/VideoDetails';
import Chat from '../components/chat/Chat';

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
                <VideoDetails id={videoId} fromCache={false}>
                    <Chat id={videoId}/>
                </VideoDetails>
            </div>
        );
    }
}

export default VideoModule;
