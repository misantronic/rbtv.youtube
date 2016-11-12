import React from 'react';
import _ from 'underscore';
import Collection from '../../app/modules/playlistsDetails/models/PlaylistItems';
import PlaylistItems from '../components/playlists/PlaylistItems';
import VideoDetails from '../components/video/details/VideoDetails';

class PlaylistModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_selectItem', '_onFetch');

        const collection = new Collection();
        const playlistId = this.props.routeParams.id;
        const videoId = this.props.routeParams.videoId;
        const autoplay = false;

        collection.setPlaylistId(playlistId);

        this.state = {
            collection,
            playlistId,
            autoplay,
            videoId
        };

        collection.listenTo(collection, 'react:update', () => this.forceUpdate());
    }

    render() {
        const collection = this.state.collection;
        const videoId = this.state.videoId;

        return (
            <div className="module-playlist">
                <VideoDetails id={videoId}>
                    <PlaylistItems id={videoId} collection={collection} onFetch={this._onFetch} onItemSelected={item => this._selectItem(item)}/>
                </VideoDetails>
            </div>
        );
    }

    _selectItem(item = null, autoplay = false) {
        const collection = this.state.collection;
        const playlistId = this.state.playlistId;

        if (!item) {
            item = collection.first();
        }

        const videoId = item.get('videoId');

        this.setState({
            autoplay,
            videoId
        });

        this.props.router.push(`playlists/${playlistId}/video/${videoId}`);
    }

    _onFetch(collection) {
        const videoId = this.state.videoId;

        if (!videoId) {
            this._selectItem(collection.first());
        }
    }
}

export default PlaylistModule;
