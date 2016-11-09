import React from 'react';
import _ from 'underscore';
import Collection from '../../app/modules/playlistsDetails/models/PlaylistItems';
import PlaylistItems from '../components/playlists/PlaylistItems';
import VideoDetails from '../components/video/details/VideoDetails';

class PlaylistModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_selectItem');

        const collection = new Collection();
        const playlistId = this.props.routeParams.id;

        collection.setPlaylistId(playlistId);

        this.state = {
            collection,
            playlistId,
            autoplay: false,
            videoId: null
        };

        collection.listenTo(collection, 'react:update', () => this.forceUpdate());
    }

    render() {
        const collection = this.state.collection;
        const videoId = this.state.videoId;

        return (
            <div className="module-playlist">
                <VideoDetails id={videoId}>
                    <PlaylistItems id={videoId} collection={collection} onItemSelected={item => this._selectItem(item)}/>
                </VideoDetails>
            </div>
        );
    }

    componentDidMount() {
        const collection = this.state.collection;

        collection
            .fetch()
            .then(() => this._selectItem());
    }

    _selectItem(item = null, autoplay = false) {
        const collection = this.state.collection;

        if (!item) {
            item = collection.first();
        }

        this.setState({
            autoplay,
            videoId: item.get('videoId')
        });
    }
}

export default PlaylistModule;
