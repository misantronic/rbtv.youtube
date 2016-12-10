import React from 'react';
import _ from 'underscore';
import Collection from '../datasource/collections/PlaylistItemsCollection';
import CommentTreadModel from '../datasource/models/CommentTreadModel';
import CommentThreadsCollection from '../datasource/collections/CommentThreadsCollection';
import PlaylistItems from '../components/playlists/PlaylistItems';
import VideoDetails from '../components/video/details/VideoDetails';
import CommentThreadsList from '../components/comments/CommentThreadsList';
import CommentForm from '../components/comments/CommentForm';
import youtubeController from '../utils/youtubeController';

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
