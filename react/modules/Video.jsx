import React from 'react';
import {Component} from 'react';
import VideoPlayer from './../components/VideoPlayer/Player';

class Video extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoId: this.props.routeParams.id
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

export default Video;
