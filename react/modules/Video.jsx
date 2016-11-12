import React from 'react';
import _ from 'underscore';
import Collection from '../../app/modules/search/models/RelatedResults';
import PlaylistItems from '../components/playlists/PlaylistItems';
import VideoDetails from '../components/video/details/VideoDetails';

class VideoModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onFetch', '_onItemSelected');

        const videoId = this.props.routeParams.id;
        const collection = new Collection();
        const autoplay = false;

        this.state = {
            collection,
            autoplay,
            videoId
        };

        collection.listenTo(collection, 'react:update', () => this.forceUpdate());
    }

    render() {
        const videoId = this.state.videoId;
        const collection = this.state.collection;

        return (
            <div className="module-video">
                <VideoDetails id={videoId} onFetch={this._onFetch}>
                    <PlaylistItems id={videoId} collection={collection} onItemSelected={this._onItemSelected}/>
                </VideoDetails>
            </div>
        );
    }

    _onItemSelected(item = null) {
        const collection = this.state.collection;

        item = item || collection.first();

        const videoId = item.get('videoId');

        this.setState({ videoId });

        this.props.router.push(`video/${videoId}`);
    }

    _onFetch(videoModel) {
        const channelId = videoModel.get('channelId');
        const collection = this.state.collection;
        const videoId = this.state.videoId;

        collection
            .setRelatedToVideoId(videoId)
            .setChannelId(channelId);

        this.setState({ collection: collection.clone() });
    }
}

export default VideoModule;
