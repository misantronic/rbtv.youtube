const React = require('react');
const _ = require('underscore');
const ThumbsComponent = require('../video/details/Thumbs');
const CommentList = require('./CommentList');
const CommentForm = require('./CommentForm');
const CommentsCollection = require('../../datasource/collections/CommentsCollection');
const CommentModel = require('../../datasource/models/CommentModel');
const BtnContextMenu = require('../commons/BtnContextMenu');
const storage = require('../../utils/storage');
const youtubeController = require('../../utils/youtubeController');

/**
 * @class CommentItemComponent
 */
class CommentItemComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        _.bindAll(this, '_onToggleReplies', '_onClickDelete', '_onClickUpdate', '_onUpdateSuccess', '_onUpdateAbort', '_onClickReply');

        const editing = props.editing;
        const showReplies = false;
        const repliesCollection = new CommentsCollection();

        this.state = {
            repliesCollection,
            showReplies,
            editing
        };

        repliesCollection.setParentId(props.item.id);
    }

    getChildContext() {
        return { collection: this.state.repliesCollection };
    }

    getContextMenu() {
        return [
            {
                name: 'edit',
                fun: this._onClickUpdate
            },
            {
                name: 'delete',
                fun: this._onClickDelete
            }
        ];
    }

    render() {
        const isEditing = this.state.editing;

        const item = this.props.item;
        const snippet = item.get('snippet');
        const image = snippet.authorProfileImageUrl;
        const author = snippet.authorDisplayName;
        const authorChannel = snippet.authorChannelUrl;
        const authorChannelId = snippet.authorChannelId.value;
        const text = snippet.textDisplay;
        const publishedAt = snippet.publishedAt;
        const numReplies = snippet.totalReplyCount;
        const likeCount = snippet.likeCount;
        const dislikeCount = null;

        const channelInfo = storage.getMyChannelInfo();
        const isMine = authorChannelId === channelInfo.id;
        const commentModel = new CommentModel(item.attributes);

        return (
            <div className="component-comment-item">
                <img className="thumb" src={image} alt={author}/>
                <div className="content">
                    <div className="body">
                        { isEditing
                            ? <CommentForm model={commentModel} method="updateComment" onComment={this._onUpdateSuccess} onAbort={this._onUpdateAbort}/>
                            : <p dangerouslySetInnerHTML={{ __html: text }}></p>
                        }
                        { isMine
                            ? <BtnContextMenu menu={this.getContextMenu()}/>
                            : null
                        }
                    </div>
                    <div className="reactions">
                        <a href="#" onClick={this._onClickReply}>Reply</a>
                        <ThumbsComponent statistics={{ likeCount, dislikeCount }}/>
                        <div className="right">
                            <a href={authorChannel} target="_blank">{author}</a>
                            <span className="published-at">, {publishedAt.fromNow()}</span>
                        </div>
                    </div>
                    {
                        numReplies
                            ? <a href="#" className="btn-replies" onClick={this._onToggleReplies}>{this.state.showReplies ? 'hide' : 'show'} {numReplies} replies</a>
                            : null
                    }
                    <CommentList />
                </div>
            </div>
        );
    }

    _onToggleReplies(e) {
        const showReplies = this.state.showReplies;
        const repliesCollection = this.state.repliesCollection;

        this.setState({ showReplies: !showReplies }, () => {
            if (showReplies) {
                repliesCollection.reset();
                this.forceUpdate();
            } else {
                repliesCollection.fetch();
            }
        });

        e.preventDefault();
    }

    _onClickReply(e) {
        const item = this.props.item;

        console.log('_onClickReply()', item);

        e.preventDefault();
    }

    _onClickUpdate() {
        this.setState({ editing: true });
    }

    _onClickDelete() {
        const item = this.props.item;

        youtubeController
            .removeComment(item)
            .then(() => {
                item.collection.remove(item);

                youtubeController.invalidateComments(`commentThreads.${this.context.videoId}`);
                youtubeController.invalidateComments(`comments.${this.context.videoId}`);
            });
    }

    _onUpdateSuccess(attributes) {
        const item = this.props.item;

        item.set(item.parse(attributes));

        this.setState({ editing: false });
    }

    _onUpdateAbort() {
        this.setState({ editing: false });
    }
}

CommentItemComponent.defaultProps = {
    editing: false
};

CommentItemComponent.contextTypes = {
    videoId: React.PropTypes.string
};

CommentItemComponent.childContextTypes = {
    collection: React.PropTypes.object
};

CommentItemComponent.propTypes = {
    item: React.PropTypes.object
};

module.exports = CommentItemComponent;
