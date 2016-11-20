const React = require('react');
const _ = require('underscore');
const Collection = require('../datasource/collections/PlaylistItemsCollection');
const CommentTreadModel = require('../datasource/models/CommentTreadModel');
const CommentThreadsCollection = require('../datasource/collections/CommentThreadsCollection');
const PlaylistItems = require('../components/playlists/PlaylistItems');
const VideoDetails = require('../components/video/details/VideoDetails');
const CommentThreadsList = require('../components/comments/CommentThreadsList');
const CommentForm = require('../components/comments/CommentForm');
const youtubeController = require('../utils/youtubeController');

class PlaylistModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_selectItem', '_onFetch', '_onComment');

        const collection = new Collection();
        const commentThreadsCollection = new CommentThreadsCollection();
        const playlistId = this.props.routeParams.id;
        const videoId = this.props.routeParams.videoId;
        const channelId = '';
        const autoplay = false;

        collection.setPlaylistId(playlistId);

        this.state = {
            collection,
            commentThreadsCollection,
            playlistId,
            autoplay,
            videoId,
            channelId
        };

        collection.on('react:update', () => this.forceUpdate());

        youtubeController.getChannelInfo();
    }

    getChildContext() {
        return { videoId: this.state.videoId };
    }

    render() {
        const collection = this.state.collection;
        const commentThreadsCollection = this.state.commentThreadsCollection;
        const videoId = this.state.videoId;
        const channelId = this.state.channelId;
        const commentThreadModel = new CommentTreadModel({
            snippet: {
                channelId,
                videoId,
                textOriginal: ''
            }
        });

        return (
            <div className="module-playlist">
                <VideoDetails id={videoId}>
                    <PlaylistItems id={videoId} collection={collection} onFetch={this._onFetch} onItemSelected={item => this._selectItem(item)}/>
                </VideoDetails>
                <CommentForm model={commentThreadModel} onComment={this._onComment}/>
                <CommentThreadsList collection={commentThreadsCollection} id={videoId}/>
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

        collection.off('react:update');
    }

    _selectItem(item = null, autoplay = false, routerMethod = 'push') {
        const collection = this.state.collection;
        const playlistId = this.state.playlistId;

        if (!item) {
            item = collection.first();
        }

        const videoId = item.get('videoId');
        const channelId = item.get('channelId');

        this.setState({
            autoplay,
            videoId,
            channelId
        });

        this.props.router[routerMethod](`playlists/${playlistId}/video/${videoId}`);
    }

    _onFetch(collection) {
        const videoId = this.state.videoId;
        const item = collection.findWhere({ videoId });

        if (!videoId) {
            this._selectItem(collection.first(), false, 'replace');
        }

        if (item) {
            this.setState({ channelId: item.get('channelId') });
        }
    }

    _onComment(commentData) {
        const commentThreadsCollection = this.state.commentThreadsCollection;

        commentThreadsCollection.add(commentData, { at: 0 });
        commentThreadsCollection.trigger('react:update');
    }
}

PlaylistModule.childContextTypes = {
    videoId: React.PropTypes.string
};

module.exports = PlaylistModule;
