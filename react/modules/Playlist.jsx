import React from 'react';
import _ from 'underscore';
import Collection from '../../app/modules/playlistsDetails/models/PlaylistItems';
import PlaylistItems from '../components/playlists/PlaylistItems';
import VideoPlayer from '../components/videoplayer/VideoPlayer';

class PlaylistModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onItemSelected');

        const collection = new Collection();
        const playlistId = this.props.routeParams.id;

        collection.setPlaylistId(playlistId);

        this.state = {
            collection,
            playlistId,
            videoId: null
        };

        collection.listenTo(collection, 'react:update', () => this.forceUpdate());
    }

    render() {
        const collection = this.state.collection;

        return (
            <div className="module-playlist">
                <VideoPlayer id={this.state.videoId} />
                <PlaylistItems collection={collection} onItemSelected={this._onItemSelected} />
            </div>
        );
    }

    componentDidMount() {
        const collection = this.state.collection;

        collection.fetch();
    }

    _onItemSelected(item) {
        const videoId = item.get('videoId');

        console.log('videoId', videoId);

        this.setState({ videoId });
    }
}

export default PlaylistModule;
