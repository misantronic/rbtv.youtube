import React from 'react';
import VideoDetails from '../components/video/details/VideoDetails';
import Chat from '../components/video/chat/Chat';

class VideoModule extends React.Component {
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
                <VideoDetails id={videoId} fromCache={false} liveStreamingDetails={true}>
                    <Chat id={videoId}/>
                </VideoDetails>
            </div>
        );
    }
}

module.exports = VideoModule;
