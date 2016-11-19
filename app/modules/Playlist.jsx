const React = require('react');
const _ = require('underscore');
const Collection = require('../datasource/collections/PlaylistItemsCollection');
const PlaylistItems = require('../components/playlists/PlaylistItems');
const VideoDetails = require('../components/video/details/VideoDetails');
const CommentThreadsList = require('../components/comments/CommentThreadsList');

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
                <CommentThreadsList id={videoId}/>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const videoId = this.props.routeParams.videoId;

        if (prevProps.routeParams.videoId !== videoId) {
            this.setState({ videoId });
        }
    }

    componentWillUnmount() {
        const collection = this.state.collection;

        collection.stopListening(collection, 'react:update');
    }

    _selectItem(item = null, autoplay = false, routerMethod = 'push') {
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

        this.props.router[routerMethod](`playlists/${playlistId}/video/${videoId}`);
    }

    _onFetch(collection) {
        const videoId = this.state.videoId;

        if (!videoId) {
            this._selectItem(collection.first(), false, 'replace');
        }
    }
}

module.exports = PlaylistModule;
