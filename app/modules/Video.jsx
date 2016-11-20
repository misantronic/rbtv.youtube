const React = require('react');
const _ = require('underscore');
const Collection = require('../datasource/collections/RelatedResultsCollection');
const CommentTreadModel = require('../datasource/models/CommentTreadModel');
const CommentThreadsCollection = require('../datasource/collections/CommentThreadsCollection');
const PlaylistItems = require('../components/playlists/PlaylistItems');
const VideoDetails = require('../components/video/details/VideoDetails');
const CommentThreadsList = require('../components/comments/CommentThreadsList');
const CommentForm = require('../components/comments/CommentForm');
const youtubeController = require('../utils/youtubeController');

class VideoModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onFetch', '_onItemSelected', '_onComment');

        const videoId = this.props.routeParams.id;
        const collection = new Collection();
        const commentThreadsCollection = new CommentThreadsCollection();
        const channelId = '';
        const autoplay = false;

        this.state = {
            collection,
            commentThreadsCollection,
            autoplay,
            channelId,
            videoId
        };

        collection.on('react:update', () => this.forceUpdate());

        youtubeController.getChannelInfo();
    }

    getChildContext() {
        return { videoId: this.state.videoId };
    }

    render() {
        const videoId = this.state.videoId;
        const channelId = this.state.channelId;
        const collection = this.state.collection;
        const commentThreadsCollection = this.state.commentThreadsCollection;
        const commentThreadModel = new CommentTreadModel({
            snippet: {
                channelId,
                videoId,
                textOriginal: ''
            }
        });

        return (
            <div className="module-video">
                <VideoDetails id={videoId} onFetch={this._onFetch}>
                    <PlaylistItems id={videoId} collection={collection} onItemSelected={this._onItemSelected}/>
                </VideoDetails>
                <CommentForm model={commentThreadModel} onComment={this._onComment}/>
                <CommentThreadsList collection={commentThreadsCollection} id={videoId}/>
            </div>
        );
    }

    componentWillUnmount() {
        const collection = this.state.collection;

        collection.off('react:update');
    }

    _onItemSelected(item = null) {
        const collection = this.state.collection;

        item = item || collection.first();

        const videoId = item.get('videoId');
        const channelId = item.get('channelId');

        this.setState({ videoId, channelId });

        this.props.router.push(`video/${videoId}`);
    }

    _onFetch(videoModel) {
        const channelId = videoModel.get('channelId');
        const collection = this.state.collection;
        const videoId = this.state.videoId;

        collection
            .setRelatedToVideoId(videoId)
            .setChannelId(channelId);

        this.setState({
            channelId,
            collection: collection.clone()
        });
    }

    _onComment(commentData) {
        const commentThreadsCollection = this.state.commentThreadsCollection;

        commentThreadsCollection.add(commentData, { at: 0 });
        commentThreadsCollection.trigger('react:update');
    }
}

VideoModule.childContextTypes = {
    videoId: React.PropTypes.string
};

module.exports = VideoModule;
