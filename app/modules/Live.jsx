const React = require('react');
const VideoDetails = require('../components/video/details/VideoDetails');
const Chat = require('../components/video/chat/Chat');

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
